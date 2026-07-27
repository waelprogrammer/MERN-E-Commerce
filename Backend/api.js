import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Product from "./models/Product.js";
import User from "./models/User.js";

// Load environment variables from the .env file.
dotenv.config();

// Create the Express app.
const app = express();
// Allow frontend requests from different origins.
app.use(cors());
// Let the server read JSON request bodies.
app.use(express.json());

// Use port 5000 unless another port is provided in the environment.
const PORT = process.env.PORT || 5000;
// Secret key for JWT authentication.
const SECRET_KEY = process.env.SECRET_KEY || "supersecret";
// MongoDB connection string.
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/computer-store";

// Connect to MongoDB so the app can read and write product data.
mongoose.connect(MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error", err));

const ensureAdminUser = async () => {
    const adminUsername = "admin";
    const adminPassword = "admin123";

    const existingAdmin = await User.findOne({ username: adminUsername });
    if (!existingAdmin) {
        const hashPwd = await bcrypt.hash(adminPassword, 10);
        await User.create({ username: adminUsername, password: hashPwd, role: "admin" });
        console.log("Admin user created in MongoDB");
    }
};

ensureAdminUser().catch((err) => console.error("Admin user setup failed", err));

// Register a new user.
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
    }

    const hashPwd = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username: username.toLowerCase(), password: hashPwd, role: "user" });

    res.json({ message: "User registered successfully", user: { id: newUser.id, username: newUser.username, role: newUser.role } });
});

// Login an existing user.
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { username: user.username, role: user.role },
        SECRET_KEY,
        { expiresIn: "1h" }
    );

    res.json({ token, user: { username: user.username, role: user.role } });
});

// Middleware to protect routes that require login.
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Unauthorized" });
        req.user = decoded;
        next();
    });
};

const authenticateAdmin = (req, res, next) => {
    authenticate(req, res, () => {
        if (req.user?.role !== "admin") {
            return res.status(403).json({ message: "Admin access required" });
        }
        next();
    });
};

// Get all active products from MongoDB.
app.get("/Products", async (req, res) => {
    const products = await Product.find({ active: true }).sort({ createdAt: -1 });
    res.json(products);
});

// Get all active products for the frontend API route.
app.get("/api/Products", async (req, res) => {
    const products = await Product.find({ active: true }).sort({ createdAt: -1 });
    res.json(products);
});

// Get featured products for the homepage section.
app.get("/api/featured-products", async (req, res) => {
    const products = await Product.find({ featured: true, active: true }).limit(3);
    res.json(products);
});

// Get one product by its MongoDB id.
app.get("/api/Products/:id", authenticate, async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
});

// Create a new product in MongoDB.
app.post("/Products", authenticate, async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json(newProduct);
});

// Update a product by id.
app.put("/Products/:id", authenticate, async (req, res) => {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
});

// Deactivate a product instead of deleting it.
app.patch("/Products/:id/deactivate", authenticate, async (req, res) => {
    const updated = await Product.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
});

// Delete a product from MongoDB.
app.delete("/Products/:id", authenticate, async (req, res) => {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
});

// Admin route to get all products for management.
app.get("/api/admin/products", authenticateAdmin, async (req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
});

// Admin route to get all registered usernames.
app.get("/api/admin/users", authenticateAdmin, async (req, res) => {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    res.json(users.map((user) => ({ username: user.username, role: user.role })));
});

// Start the server and listen for requests.
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
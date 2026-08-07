import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "./models/User.js";
import { SECRET_KEY } from "./middleware/auth.js";
import productsRouter from "./routes/products.js";
import adminRouter from "./routes/admin.js";

// Load environment variables from the .env file.
dotenv.config();

// Create the Express app.
const app = express();
// Allow frontend requests from different origins.
app.use(cors());
// Let the server read JSON request bodies.
app.use(express.json());

// Use port 5000 unless another port is provided in the environment.
const PORT = process.env.PORT || 5002;
// MongoDB connection string.
const MONGO_URI = process.env.MONGO_URI;

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

    // Without this check, a missing username would crash on .toLowerCase() below.
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { username: user.username, role: user.role },
        SECRET_KEY
    );

    res.json({ token, user: { username: user.username, role: user.role } });
});

app.use(productsRouter);
app.use(adminRouter);

// Start the server and listen for requests.
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

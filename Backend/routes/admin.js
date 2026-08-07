import express from "express";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { authenticateAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/admin/products", authenticateAdmin, async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

router.post("/admin/products", authenticateAdmin, async (req, res) => {
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
});

router.put("/admin/products/:id", authenticateAdmin, async (req, res) => {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
});

router.patch("/admin/products/:id/deactivate", authenticateAdmin, async (req, res) => {
    const updated = await Product.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
});

router.delete("/admin/products/:id", authenticateAdmin, async (req, res) => {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
});

router.get("/admin/users", authenticateAdmin, async (req, res) => {
    const users = await User.find({}, { password: 0 });
    res.json(users.map((user) => ({ username: user.username, role: user.role, _id: user._id })));
});

export default router;

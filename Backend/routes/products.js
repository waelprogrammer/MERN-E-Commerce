import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// Get all active products for the frontend.
router.get("/products", async (req, res) => {
    const products = await Product.find({ active: true });
    res.json(products);
});

// Get featured products for the homepage section.
router.get("/featured-products", async (req, res) => {
    const products = await Product.find({ featured: true, active: true }).limit(3);
    res.json(products);
});

export default router;

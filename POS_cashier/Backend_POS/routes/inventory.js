const Product = require("../models/Product.js");
const express = require("express");
const router = express.Router();

// All products with stock info
router.get("/total-stock", async (req, res) => {
  try {
    const products = await Product.find().sort({ title: 1 });
    res.status(200).json(products);
  } catch (e) { res.status(500).json(e); }
});

// Out of stock: quantity === 0
router.get("/out-of-stock", async (req, res) => {
  try {
    const products = await Product.find({ stock: 0 }).sort({ title: 1 });
    res.status(200).json(products);
  } catch (e) { res.status(500).json(e); }
});

// Stock alert: quantity > 0 but < 10
router.get("/alerts", async (req, res) => {
  try {
    const products = await Product.find({ stock: { $gt: 0, $lt: 10 } }).sort({ stock: 1 });
    res.status(200).json(products);
  } catch (e) { res.status(500).json(e); }
});

module.exports = router;

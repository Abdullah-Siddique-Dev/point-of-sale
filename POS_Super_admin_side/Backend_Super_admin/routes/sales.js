const express = require("express");
const Sale = require("../models/Sale.js");
const router = express.Router();

// Get all sales
router.get("/get-all", async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Create new sale
router.post("/add-sale", async (req, res) => {
  try {
    const newSale = new Sale(req.body);
    await newSale.save();
    res.status(200).json("Sale created successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update sale
router.put("/update-sale/:id", async (req, res) => {
  try {
    await Sale.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json("Sale updated successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete sale
router.delete("/delete-sale/:id", async (req, res) => {
  try {
    await Sale.findByIdAndDelete(req.params.id);
    res.status(200).json("Sale deleted successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get sale by ID
router.get("/get-sale/:id", async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;

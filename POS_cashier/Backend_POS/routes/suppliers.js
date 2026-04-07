const Supplier = require("../models/Supplier.js");
const express = require("express");
const router = express.Router();

// get all
router.get("/get-all", async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.status(200).json(suppliers);
  } catch (e) { res.status(500).json(e); }
});

// add
router.post("/add-supplier", async (req, res) => {
  try {
    // Strip oversized base64 images — store URL or small images only
    const data = { ...req.body };
    if (data.img && data.img.length > 500000) {
      data.img = ""; // drop images over ~375KB base64
    }
    const supplier = new Supplier(data);
    await supplier.save();
    res.status(200).json(supplier);
  } catch (e) { res.status(500).json(e); }
});

// update
router.put("/update-supplier", async (req, res) => {
  try {
    const updated = await Supplier.findByIdAndUpdate(req.body.supplierId, req.body, { new: true });
    res.status(200).json(updated);
  } catch (e) { res.status(500).json(e); }
});

// delete
router.delete("/delete-supplier", async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.body.supplierId);
    res.status(200).json("Supplier deleted.");
  } catch (e) { res.status(500).json(e); }
});

module.exports = router;

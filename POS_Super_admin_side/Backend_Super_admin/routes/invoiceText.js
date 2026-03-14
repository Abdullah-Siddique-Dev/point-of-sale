const express = require("express");
const InvoiceText = require("../models/InvoiceText.js");
const router = express.Router();

// Get invoice text settings
router.get("/get-settings", async (req, res) => {
  try {
    const settings = await InvoiceText.findOne({ isActive: true });
    if (!settings) {
      const defaultSettings = new InvoiceText({});
      await defaultSettings.save();
      return res.status(200).json(defaultSettings);
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update invoice text settings
router.put("/update-settings/:id", async (req, res) => {
  try {
    await InvoiceText.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json("Invoice text settings updated successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;

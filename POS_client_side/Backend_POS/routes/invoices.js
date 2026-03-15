const Invoice = require("../models/Invoice.js");
const express = require("express");
const router = express.Router();

//! create invoice
router.post("/add-invoice", async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(200).json(invoice);
  } catch (error) {
    res.status(400).json(error);
  }
});

//! get all invoices
router.get("/get-all", async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.status(200).json(invoices);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;

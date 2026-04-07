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

//! delete invoice
router.delete("/delete-invoice", async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.body.invoiceId);
    res.status(200).json("Invoice deleted.");
  } catch (error) {
    res.status(500).json(error);
  }
});

//! refund invoice (mark as Refunded)
router.put("/refund-invoice", async (req, res) => {
  try {
    const updated = await Invoice.findByIdAndUpdate(
      req.body.invoiceId,
      { status: "Refunded" },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;

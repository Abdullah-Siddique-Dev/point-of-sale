const Purchase = require("../models/Purchase.js");
const PurchaseReturn = require("../models/PurchaseReturn.js");
const Product = require("../models/Product.js");
const express = require("express");
const router = express.Router();

// Get all purchases
router.get("/get-all", async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ createdAt: -1 });
    res.status(200).json(purchases);
  } catch (e) { res.status(500).json(e); }
});

// Add purchase — also increases product stock
router.post("/add-purchase", async (req, res) => {
  try {
    const purchase = new Purchase(req.body);
    await purchase.save();

    // Increase stock for each item
    for (const item of req.body.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } }
      );
    }

    res.status(200).json(purchase);
  } catch (e) { res.status(500).json(e); }
});

// Delete purchase
router.delete("/delete-purchase", async (req, res) => {
  try {
    await Purchase.findByIdAndDelete(req.body.purchaseId);
    res.status(200).json("Purchase deleted.");
  } catch (e) { res.status(500).json(e); }
});

// Get all purchase returns
router.get("/returns/get-all", async (req, res) => {
  try {
    const returns = await PurchaseReturn.find().sort({ createdAt: -1 });
    res.status(200).json(returns);
  } catch (e) { res.status(500).json(e); }
});

// Add purchase return — decreases product stock
router.post("/returns/add", async (req, res) => {
  try {
    const ret = new PurchaseReturn(req.body);
    await ret.save();

    // Decrease stock for each returned item
    for (const item of req.body.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(200).json(ret);
  } catch (e) { res.status(500).json(e); }
});

// Delete return
router.delete("/returns/delete", async (req, res) => {
  try {
    await PurchaseReturn.findByIdAndDelete(req.body.returnId);
    res.status(200).json("Return deleted.");
  } catch (e) { res.status(500).json(e); }
});

module.exports = router;

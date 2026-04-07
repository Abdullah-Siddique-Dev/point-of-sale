const mongoose = require("mongoose");

const PurchaseItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  total: { type: Number, required: true },
});

const PurchaseSchema = mongoose.Schema(
  {
    supplierId: { type: String, required: true },
    supplierName: { type: String, required: true },
    items: [PurchaseItemSchema],
    totalAmount: { type: Number, required: true },
    notes: { type: String, default: "" },
    status: { type: String, default: "Received" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("purchases", PurchaseSchema);

const mongoose = require("mongoose");

const ReturnItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  total: { type: Number, required: true },
});

const PurchaseReturnSchema = mongoose.Schema(
  {
    purchaseId: { type: String, required: true },
    supplierId: { type: String, required: true },
    supplierName: { type: String, required: true },
    items: [ReturnItemSchema],
    totalAmount: { type: Number, required: true },
    reason: { type: String, default: "" },
    status: { type: String, default: "Returned" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("purchase_returns", PurchaseReturnSchema);

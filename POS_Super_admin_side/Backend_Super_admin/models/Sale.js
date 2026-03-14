const mongoose = require("mongoose");

const SaleSchema = mongoose.Schema(
  {
    saleNumber: { type: String, required: true, unique: true },
    storeName: { type: String, required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    items: [
      {
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    status: { type: String, enum: ["completed", "pending", "cancelled"], default: "completed" },
  },
  {
    timestamps: true,
  }
);

const Sale = mongoose.model("sales", SaleSchema);

module.exports = Sale;

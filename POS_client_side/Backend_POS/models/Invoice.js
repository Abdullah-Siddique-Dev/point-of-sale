const mongoose = require("mongoose");

const InvoiceSchema = mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerPhoneNumber: { type: Number, required: true },
    paymentMode: { type: String, required: true },
    cartItems: { type: Array, required: true },
    subTotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Delivered" },
  },
  {
    timestamps: true,
  }
);

const Invoice = mongoose.model("invoices", InvoiceSchema);

module.exports = Invoice;

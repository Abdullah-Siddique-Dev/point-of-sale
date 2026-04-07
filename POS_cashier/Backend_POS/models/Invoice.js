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
    cashierName: { type: String, default: "Cashier" },
    status: { type: String, default: "Delivered" },
    // NEW: Tax fields (optional for backward compatibility)
    taxName: { type: String, default: null },
    taxPercentage: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    // NEW: FBR placeholder fields (for future use)
    fbrInvoiceNo: { type: String, default: null },
    fbrStatus: { type: String, default: null },
    fbrResponse: { type: Object, default: null },
  },
  {
    timestamps: true,
  }
);

const Invoice = mongoose.model("invoices", InvoiceSchema);

module.exports = Invoice;

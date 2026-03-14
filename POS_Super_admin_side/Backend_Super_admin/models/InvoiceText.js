const mongoose = require("mongoose");

const InvoiceTextSchema = mongoose.Schema(
  {
    headerText: { type: String, default: "" },
    footerText: { type: String, default: "" },
    termsAndConditions: { type: String, default: "" },
    thankYouMessage: { type: String, default: "Thank you for your business!" },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const InvoiceText = mongoose.model("invoiceTexts", InvoiceTextSchema);

module.exports = InvoiceText;

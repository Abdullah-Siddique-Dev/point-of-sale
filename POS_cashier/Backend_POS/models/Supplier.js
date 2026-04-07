const mongoose = require("mongoose");

const SupplierSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    company: { type: String, default: "" },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, default: "" },
    img: { type: String, default: "" },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("suppliers", SupplierSchema);

const mongoose = require("mongoose");

const TaxSchema = mongoose.Schema(
  {
    taxName: {
      type: String,
      required: true,
      unique: true,
    },
    taxPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    status: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Tax = mongoose.model("taxes", TaxSchema);
module.exports = Tax;

const mongoose = require("mongoose");

const TaxAssignmentSchema = mongoose.Schema(
  {
    assignmentType: {
      type: String,
      enum: ["product", "category"],
      required: true,
    },
    productId: {
      type: String,
      default: null,
    },
    productName: {
      type: String,
      default: null,
    },
    categoryName: {
      type: String,
      default: null,
    },
    taxId: {
      type: String,
      required: true,
    },
    taxName: {
      type: String,
      required: true,
    },
    taxPercentage: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const TaxAssignment = mongoose.model("taxassignments", TaxAssignmentSchema);
module.exports = TaxAssignment;

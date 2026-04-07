const mongoose = require("mongoose");

const SubCategorySchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "categories", required: true },
    categoryName: { type: String, required: true },
  },
  { timestamps: true }
);

const SubCategory = mongoose.model("subcategories", SubCategorySchema);

module.exports = SubCategory;

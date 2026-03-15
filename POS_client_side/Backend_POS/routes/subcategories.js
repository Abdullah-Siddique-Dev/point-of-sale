const SubCategory = require("../models/SubCategory.js");
const express = require("express");
const router = express.Router();

router.get("/get-all", async (req, res) => {
  try {
    const subs = await SubCategory.find();
    res.status(200).json(subs);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/add-subcategory", async (req, res) => {
  try {
    const sub = new SubCategory(req.body);
    await sub.save();
    res.status(200).json("Sub category added successfully.");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/update-subcategory", async (req, res) => {
  try {
    await SubCategory.findOneAndUpdate({ _id: req.body.subCategoryId }, req.body);
    res.status(200).json("Sub category updated successfully.");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/delete-subcategory", async (req, res) => {
  try {
    await SubCategory.findOneAndDelete({ _id: req.body.subCategoryId });
    res.status(200).json("Sub category deleted successfully.");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Tax = require("../models/Tax");
const TaxAssignment = require("../models/TaxAssignment");

// ==========================================
// GET ALL TAXES (ADMIN ONLY)
// ==========================================
router.get("/get-all", async (req, res) => {
  try {
    const taxes = await Tax.find().sort({ createdAt: -1 });
    res.status(200).json(taxes);
  } catch (error) {
    console.error("Get All Taxes Error:", error);
    res.status(500).json({ message: "Failed to fetch taxes" });
  }
});

// ==========================================
// GET ACTIVE TAX (FOR POS) - DEPRECATED
// Use /tax/assignment/product/:productId instead
// ==========================================
router.get("/active", async (req, res) => {
  try {
    const activeTax = await Tax.findOne({ status: true });
    if (!activeTax) {
      return res.status(200).json(null);
    }
    res.status(200).json(activeTax);
  } catch (error) {
    console.error("Get Active Tax Error:", error);
    res.status(500).json({ message: "Failed to fetch active tax" });
  }
});

// ==========================================
// CREATE NEW TAX (ADMIN ONLY)
// ==========================================
router.post("/add", async (req, res) => {
  try {
    const { taxName, taxPercentage, status, description } = req.body;

    // Check if tax name already exists
    const existingTax = await Tax.findOne({ taxName });
    if (existingTax) {
      return res.status(400).json({ message: "Tax name already exists" });
    }

    const newTax = new Tax({
      taxName,
      taxPercentage,
      status,
      description,
    });

    await newTax.save();
    res.status(201).json({ message: "Tax created successfully", tax: newTax });
  } catch (error) {
    console.error("Create Tax Error:", error);
    res.status(500).json({ message: "Failed to create tax" });
  }
});

// ==========================================
// UPDATE TAX (ADMIN ONLY)
// ==========================================
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { taxName, taxPercentage, status, description } = req.body;

    const updatedTax = await Tax.findByIdAndUpdate(
      id,
      { taxName, taxPercentage, status, description },
      { new: true }
    );

    if (!updatedTax) {
      return res.status(404).json({ message: "Tax not found" });
    }

    // Update all assignments with this tax
    await TaxAssignment.updateMany(
      { taxId: id },
      { taxName, taxPercentage }
    );

    res.status(200).json({ message: "Tax updated successfully", tax: updatedTax });
  } catch (error) {
    console.error("Update Tax Error:", error);
    res.status(500).json({ message: "Failed to update tax" });
  }
});

// ==========================================
// DELETE TAX (ADMIN ONLY)
// ==========================================
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if tax is assigned to any product/category
    const assignments = await TaxAssignment.find({ taxId: id });
    if (assignments.length > 0) {
      return res.status(400).json({ 
        message: "Cannot delete tax. It is assigned to products/categories. Please remove assignments first." 
      });
    }

    const deletedTax = await Tax.findByIdAndDelete(id);

    if (!deletedTax) {
      return res.status(404).json({ message: "Tax not found" });
    }

    res.status(200).json({ message: "Tax deleted successfully" });
  } catch (error) {
    console.error("Delete Tax Error:", error);
    res.status(500).json({ message: "Failed to delete tax" });
  }
});

// ==========================================
// TAX ASSIGNMENT ROUTES
// ==========================================

// Get all tax assignments
router.get("/assignments/get-all", async (req, res) => {
  try {
    const assignments = await TaxAssignment.find().sort({ createdAt: -1 });
    res.status(200).json(assignments);
  } catch (error) {
    console.error("Get Tax Assignments Error:", error);
    res.status(500).json({ message: "Failed to fetch tax assignments" });
  }
});

// Create tax assignment
router.post("/assignments/add", async (req, res) => {
  try {
    const { assignmentType, productId, productName, categoryName, taxId } = req.body;

    // Get tax details
    const tax = await Tax.findById(taxId);
    if (!tax) {
      return res.status(404).json({ message: "Tax not found" });
    }

    // Check for duplicate assignment
    let existingAssignment;
    if (assignmentType === "product") {
      existingAssignment = await TaxAssignment.findOne({ 
        assignmentType: "product", 
        productId 
      });
    } else {
      existingAssignment = await TaxAssignment.findOne({ 
        assignmentType: "category", 
        categoryName 
      });
    }

    if (existingAssignment) {
      return res.status(400).json({ 
        message: "Tax already assigned to this product/category" 
      });
    }

    const newAssignment = new TaxAssignment({
      assignmentType,
      productId,
      productName,
      categoryName,
      taxId: tax._id,
      taxName: tax.taxName,
      taxPercentage: tax.taxPercentage,
    });

    await newAssignment.save();
    res.status(201).json({ 
      message: "Tax assigned successfully", 
      assignment: newAssignment 
    });
  } catch (error) {
    console.error("Create Tax Assignment Error:", error);
    res.status(500).json({ message: "Failed to create tax assignment" });
  }
});

// Delete tax assignment
router.delete("/assignments/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAssignment = await TaxAssignment.findByIdAndDelete(id);

    if (!deletedAssignment) {
      return res.status(404).json({ message: "Tax assignment not found" });
    }

    res.status(200).json({ message: "Tax assignment deleted successfully" });
  } catch (error) {
    console.error("Delete Tax Assignment Error:", error);
    res.status(500).json({ message: "Failed to delete tax assignment" });
  }
});

// Get tax for a specific product (FOR POS)
router.get("/assignment/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const assignment = await TaxAssignment.findOne({ 
      assignmentType: "product", 
      productId 
    });
    
    if (!assignment) {
      return res.status(200).json(null);
    }
    
    res.status(200).json(assignment);
  } catch (error) {
    console.error("Get Product Tax Error:", error);
    res.status(500).json({ message: "Failed to fetch product tax" });
  }
});

// Get tax for a specific category (FOR POS)
router.get("/assignment/category/:categoryName", async (req, res) => {
  try {
    const { categoryName } = req.params;
    const assignment = await TaxAssignment.findOne({ 
      assignmentType: "category", 
      categoryName 
    });
    
    if (!assignment) {
      return res.status(200).json(null);
    }
    
    res.status(200).json(assignment);
  } catch (error) {
    console.error("Get Category Tax Error:", error);
    res.status(500).json({ message: "Failed to fetch category tax" });
  }
});

module.exports = router;

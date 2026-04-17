const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");
const Purchase = require("../models/Purchase");
const Product = require("../models/Product");

// ==========================================
// SALES REPORT (ADMIN ONLY)
// ==========================================
router.get("/sales", async (req, res) => {
  try {
    const { startDate, endDate, paymentMode, status } = req.query;

    // Build query filter
    let filter = {};
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }
    
    if (paymentMode && paymentMode !== "all") {
      filter.paymentMode = paymentMode;
    }
    
    if (status && status !== "all") {
      filter.status = status;
    }

    // Get all invoices matching filter
    const invoices = await Invoice.find(filter).sort({ createdAt: -1 });

    // Calculate summary
    const totalSales = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalInvoices = invoices.length;
    
    const statusCount = {
      delivered: invoices.filter(inv => inv.status === "Delivered").length,
      refunded: invoices.filter(inv => inv.status === "Refunded").length,
      pending: invoices.filter(inv => inv.status === "Pending").length,
    };

    const paymentBreakdown = {};
    invoices.forEach(inv => {
      if (!paymentBreakdown[inv.paymentMode]) {
        paymentBreakdown[inv.paymentMode] = { count: 0, amount: 0 };
      }
      paymentBreakdown[inv.paymentMode].count++;
      paymentBreakdown[inv.paymentMode].amount += inv.totalAmount;
    });

    res.status(200).json({
      success: true,
      summary: {
        totalSales,
        totalInvoices,
        statusCount,
        paymentBreakdown,
      },
      data: invoices,
    });
  } catch (error) {
    console.error("Sales Report Error:", error);
    res.status(500).json({ success: false, message: "Failed to generate sales report" });
  }
});

// ==========================================
// PURCHASE REPORT (ADMIN ONLY)
// ==========================================
router.get("/purchase", async (req, res) => {
  try {
    const { startDate, endDate, supplierId } = req.query;

    // Build query filter
    let filter = {};
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }
    
    if (supplierId && supplierId !== "all") {
      filter.supplierId = supplierId;
    }

    // Get all purchases matching filter
    const purchases = await Purchase.find(filter).sort({ createdAt: -1 });

    // Calculate summary
    const totalPurchaseAmount = purchases.reduce((sum, pur) => sum + pur.totalAmount, 0);
    const totalPurchaseCount = purchases.length;
    
    const supplierSummary = {};
    purchases.forEach(pur => {
      if (!supplierSummary[pur.supplierName]) {
        supplierSummary[pur.supplierName] = { count: 0, amount: 0 };
      }
      supplierSummary[pur.supplierName].count++;
      supplierSummary[pur.supplierName].amount += pur.totalAmount;
    });

    res.status(200).json({
      success: true,
      summary: {
        totalPurchaseAmount,
        totalPurchaseCount,
        supplierSummary,
      },
      data: purchases,
    });
  } catch (error) {
    console.error("Purchase Report Error:", error);
    res.status(500).json({ success: false, message: "Failed to generate purchase report" });
  }
});

// ==========================================
// STOCK REPORT (ADMIN ONLY)
// ==========================================
router.get("/stock", async (req, res) => {
  try {
    // Get all products
    const products = await Product.find().sort({ title: 1 });

    // Get all purchases and invoices for calculations
    const purchases = await Purchase.find();
    const invoices = await Invoice.find();

    // ⚡ Bolt: Replace O(n²) nested loops with O(n) hash map lookups
    const purchaseMap = {};
    purchases.forEach(purchase => {
      purchase.items.forEach(item => {
        const id = item.productId;
        purchaseMap[id] = (purchaseMap[id] || 0) + item.quantity;
      });
    });

    const salesMap = {};
    invoices.forEach(invoice => {
      invoice.cartItems.forEach(item => {
        const id = item._id;
        salesMap[id] = (salesMap[id] || 0) + item.quantity;
      });
    });

    // Calculate stock for each product
    const stockReport = products.map(product => {
      const pId = product._id.toString();
      const totalPurchased = purchaseMap[pId] || 0;
      const totalSold = salesMap[pId] || 0;

      // Current stock from database
      const currentStock = product.stock;

      // Determine status
      let stockStatus = "Normal";
      if (currentStock === 0) {
        stockStatus = "Out of Stock";
      } else if (currentStock < 10) {
        stockStatus = "Low Stock";
      }

      return {
        _id: product._id,
        productName: product.title,
        category: product.category,
        price: product.price,
        totalPurchased,
        totalSold,
        currentStock,
        stockStatus,
      };
    });

    // Calculate summary
    const totalProducts = products.length;
    const lowStockCount = stockReport.filter(p => p.stockStatus === "Low Stock").length;
    const outOfStockCount = stockReport.filter(p => p.stockStatus === "Out of Stock").length;
    const totalStockValue = stockReport.reduce((sum, p) => sum + (p.currentStock * p.price), 0);

    res.status(200).json({
      success: true,
      summary: {
        totalProducts,
        lowStockCount,
        outOfStockCount,
        totalStockValue,
      },
      data: stockReport,
    });
  } catch (error) {
    console.error("Stock Report Error:", error);
    res.status(500).json({ success: false, message: "Failed to generate stock report" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");
const Purchase = require("../models/Purchase");
const Product = require("../models/Product");
const Tax = require("../models/Tax");

// ==========================================
// COMPREHENSIVE DASHBOARD API
// ==========================================
router.get("/stats", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // Fetch all data in parallel
    const [
      allInvoices,
      todayInvoices,
      lastMonthInvoices,
      allProducts,
      allPurchases,
      todayTaxData,
      monthTaxData,
      activeTax
    ] = await Promise.all([
      Invoice.find(),
      Invoice.find({ createdAt: { $gte: today, $lt: tomorrow } }),
      Invoice.find({ createdAt: { $gte: lastMonth, $lt: today } }),
      Product.find(),
      Purchase.find(),
      Invoice.find({ createdAt: { $gte: today, $lt: tomorrow } }),
      Invoice.find({ createdAt: { $gte: new Date(today.getFullYear(), today.getMonth(), 1) } }),
      Tax.findOne({ status: true })
    ]);

    // Calculate metrics
    const totalProducts = allProducts.length;
    const totalOrders = allInvoices.length;
    const uniqueCustomers = new Set(allInvoices.map(i => i.customerPhoneNumber)).size;
    const totalRevenue = allInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

    // Today's metrics
    const todaySales = todayInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
    const todayOrders = todayInvoices.length;

    // Tax calculations
    const todayTax = todayTaxData.reduce((sum, inv) => sum + (inv.taxAmount || 0), 0);
    const monthTax = monthTaxData.reduce((sum, inv) => sum + (inv.taxAmount || 0), 0);

    // Last month metrics for comparison
    const lastMonthRevenue = lastMonthInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
    const lastMonthOrders = lastMonthInvoices.length;

    // Calculate growth percentages
    const revenueGrowth = lastMonthRevenue > 0 
      ? (((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1)
      : 0;
    const ordersGrowth = lastMonthOrders > 0
      ? (((totalOrders - lastMonthOrders) / lastMonthOrders) * 100).toFixed(1)
      : 0;

    // Inventory metrics
    const lowStockProducts = allProducts.filter(p => p.stock > 0 && p.stock < 10);
    const outOfStockProducts = allProducts.filter(p => p.stock === 0);
    const totalStockValue = allProducts.reduce((sum, p) => sum + (p.stock * p.price), 0);

    // Order status breakdown
    const orderStatus = {
      delivered: allInvoices.filter(inv => inv.status === "Delivered").length,
      pending: allInvoices.filter(inv => inv.status === "Pending").length,
      cancelled: allInvoices.filter(inv => inv.status === "Cancelled" || inv.status === "Refunded").length,
    };

    // Top 5 selling products
    const productSales = {};
    allInvoices.forEach(invoice => {
      invoice.cartItems.forEach(item => {
        if (!productSales[item._id]) {
          productSales[item._id] = {
            productId: item._id,
            productName: item.title,
            unitsSold: 0,
            revenue: 0,
            image: item.img || null
          };
        }
        productSales[item._id].unitsSold += item.quantity;
        productSales[item._id].revenue += item.quantity * item.price;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);

    // Sales analytics data (last 7 days)
    const salesAnalytics = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayInvoices = allInvoices.filter(inv => {
        const invDate = new Date(inv.createdAt);
        return invDate >= date && invDate < nextDate;
      });

      salesAnalytics.push({
        date: date.toISOString().split('T')[0],
        sales: dayInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
        orders: dayInvoices.length
      });
    }

    // Payment method breakdown
    const paymentBreakdown = {};
    allInvoices.forEach(inv => {
      if (!paymentBreakdown[inv.paymentMode]) {
        paymentBreakdown[inv.paymentMode] = { count: 0, amount: 0 };
      }
      paymentBreakdown[inv.paymentMode].count++;
      paymentBreakdown[inv.paymentMode].amount += inv.totalAmount;
    });

    res.status(200).json({
      success: true,
      data: {
        // Top summary cards
        summary: {
          totalProducts,
          totalOrders,
          totalCustomers: uniqueCustomers,
          totalRevenue,
          todaySales,
          todayOrders,
          totalTaxCollected: monthTax,
          revenueGrowth: parseFloat(revenueGrowth),
          ordersGrowth: parseFloat(ordersGrowth)
        },
        
        // Inventory alerts
        inventory: {
          lowStockCount: lowStockProducts.length,
          outOfStockCount: outOfStockProducts.length,
          totalStockValue,
          lowStockProducts: lowStockProducts.slice(0, 5),
          outOfStockProducts: outOfStockProducts.slice(0, 5)
        },
        
        // Order status
        orderStatus,
        
        // Top selling products
        topProducts,
        
        // Sales analytics
        salesAnalytics,
        
        // Tax summary
        taxSummary: {
          todayTax,
          monthTax,
          activeTax: activeTax ? {
            name: activeTax.taxName,
            percentage: activeTax.taxPercentage
          } : null
        },
        
        // Payment breakdown
        paymentBreakdown,
        
        // Recent orders (last 8)
        recentOrders: allInvoices.slice(0, 8)
      }
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch dashboard stats" });
  }
});

// ==========================================
// SALES ANALYTICS WITH FILTERS
// ==========================================
router.get("/sales-analytics", async (req, res) => {
  try {
    const { period = 'daily' } = req.query; // daily, weekly, monthly
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let startDate, dataPoints;
    
    if (period === 'daily') {
      // Last 7 days
      startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 6);
      dataPoints = 7;
    } else if (period === 'weekly') {
      // Last 4 weeks
      startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 27);
      dataPoints = 4;
    } else if (period === 'monthly') {
      // Last 6 months
      startDate = new Date(today);
      startDate.setMonth(startDate.getMonth() - 5);
      dataPoints = 6;
    }
    
    const invoices = await Invoice.find({ createdAt: { $gte: startDate } });
    
    const analytics = [];
    
    if (period === 'daily') {
      for (let i = 0; i < dataPoints; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        
        const dayInvoices = invoices.filter(inv => {
          const invDate = new Date(inv.createdAt);
          return invDate >= date && invDate < nextDate;
        });
        
        analytics.push({
          label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          sales: dayInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
          orders: dayInvoices.length
        });
      }
    } else if (period === 'weekly') {
      for (let i = 0; i < dataPoints; i++) {
        const weekStart = new Date(startDate);
        weekStart.setDate(weekStart.getDate() + (i * 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);
        
        const weekInvoices = invoices.filter(inv => {
          const invDate = new Date(inv.createdAt);
          return invDate >= weekStart && invDate < weekEnd;
        });
        
        analytics.push({
          label: `Week ${i + 1}`,
          sales: weekInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
          orders: weekInvoices.length
        });
      }
    } else if (period === 'monthly') {
      for (let i = 0; i < dataPoints; i++) {
        const monthStart = new Date(startDate);
        monthStart.setMonth(monthStart.getMonth() + i);
        const monthEnd = new Date(monthStart);
        monthEnd.setMonth(monthEnd.getMonth() + 1);
        
        const monthInvoices = invoices.filter(inv => {
          const invDate = new Date(inv.createdAt);
          return invDate >= monthStart && invDate < monthEnd;
        });
        
        analytics.push({
          label: monthStart.toLocaleDateString('en-US', { month: 'short' }),
          sales: monthInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
          orders: monthInvoices.length
        });
      }
    }
    
    res.status(200).json({
      success: true,
      period,
      data: analytics
    });
  } catch (error) {
    console.error("Sales Analytics Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch sales analytics" });
  }
});

module.exports = router;

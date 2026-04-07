const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const logger = require("morgan");
const dns = require("dns");

// Force Node.js to use Google DNS (fixes SRV lookup issues on some routers)
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

//routes
const categoryRoute = require("./routes/categories.js");
const subCategoryRoute = require("./routes/subcategories.js");
const productRoute = require("./routes/products.js");
const invoiceRoute = require("./routes/invoices.js");
const authRoute = require("./routes/auth.js");
const userRoute = require("./routes/users.js");
const supplierRoute = require("./routes/suppliers.js");
const purchaseRoute = require("./routes/purchases.js");
const inventoryRoute = require("./routes/inventory.js");
const reportsRoute = require("./routes/reports.js"); // NEW: Reports module
const taxRoute = require("./routes/tax.js"); // NEW: Tax module
const dashboardRoute = require("./routes/dashboard.js"); // NEW: Dashboard module

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    // Retry after 5 seconds instead of crashing
    setTimeout(connect, 5000);
  }
};

// Handle connection drops and auto-reconnect
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected — reconnecting...");
  setTimeout(connect, 3000);
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err.message);
});

//middlewares
app.use(logger("dev"));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use(cors());

app.use("/api/categories", categoryRoute);
app.use("/api/subcategories", subCategoryRoute);
app.use("/api/products", productRoute);
app.use("/api/invoices", invoiceRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/suppliers", supplierRoute);
app.use("/api/purchases", purchaseRoute);
app.use("/api/inventory", inventoryRoute);
app.use("/api/reports", reportsRoute); // NEW: Reports API endpoint
app.use("/api/tax", taxRoute); // NEW: Tax API endpoint
app.use("/api/dashboard", dashboardRoute); // NEW: Dashboard API endpoint

app.listen(port, () => {
  connect();
  console.log(`Listening on port ${port}`);
});

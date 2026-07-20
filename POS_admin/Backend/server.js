const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const logger = require("morgan");
const dns = require("dns");
const port = process.env.PORT || 5000;

// Force Node.js to use Google DNS (fixes SRV lookup issues on some routers)
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

//routes
const salesRoute = require("./routes/sales.js");
const invoiceTextRoute = require("./routes/invoiceText.js");

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB - Super Admin");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    setTimeout(connect, 5000);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected — reconnecting...");
  setTimeout(connect, 3000);
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err.message);
});

//middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(cors());

app.use("/api/sales", salesRoute);
app.use("/api/invoice-text", invoiceTextRoute);

app.listen(port, () => {
  connect();
  console.log(`Super Admin API listening on port ${port}`);
});

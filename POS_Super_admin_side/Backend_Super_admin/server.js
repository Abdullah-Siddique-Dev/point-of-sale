const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const logger = require("morgan");
const port = process.env.PORT || 5000;

dotenv.config();

//routes
const salesRoute = require("./routes/sales.js");
const invoiceTextRoute = require("./routes/invoiceText.js");

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB - Super Admin");
  } catch (error) {
    throw error;
  }
};

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

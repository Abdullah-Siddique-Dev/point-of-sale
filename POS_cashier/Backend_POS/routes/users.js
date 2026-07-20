const User = require("../models/User.js");
const express = require("express");
const router = express.Router();

//! get users
router.get("/get-all", async (req, res) => {
  try {
    // SECURITY FIX: Do not expose password hashes in API response
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

//! get a user
router.get("/", async (req, res) => {
  const userId = req.body.userId;
  try {
    // SECURITY FIX: Do not expose password hashes in API response
    const user = await User.findById(userId).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;

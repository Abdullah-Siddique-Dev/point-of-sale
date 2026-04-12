const User = require("../models/User.js");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

//! register
router.post("/register", async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // 🛡️ Sentinel Security Fix: Prevent Mass Assignment (Privilege Escalation)
    // Force role to "cashier" for open registrations to prevent malicious users from creating "admin" accounts
    const newUser = new User({ userName, email, password: hashedPassword, role: "cashier" });
    await newUser.save();
    res.status(200).json("A new user created successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

//! login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ error: "User not found!" });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      res.status(403).json({ error: "Invalid Password!" });
    } else {
      res.status(200).json({
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;

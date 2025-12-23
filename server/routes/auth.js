const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middleware/auth");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const router = express.Router();

// ================= Nodemailer Setup =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "cjcj42001@gmail.com", 
    pass: "Almora@12345", 
  }
});

// ================= SIGNUP =================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));

    await User.create({
      name,
      email,
      password: hashedPassword,
      income: 0,
    });

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found", action: "signup" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, "finledgerSecret", { expiresIn: "1d" });

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET PROFILE =================
router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// ================= UPDATE PROFILE =================
router.put("/updateProfile", authMiddleware, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password && password.trim() !== "")
      updateData.password = await bcrypt.hash(password, await bcrypt.genSalt(10));

    await User.findByIdAndUpdate(req.user.id, updateData);

    return res.status(200).json({
      message: "Profile updated successfully. Please login again.",
      reLogin: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= FORGOT PASSWORD =================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.json({ message: "If email exists, reset link sent" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    const resetLink = `http://localhost:3000/reset-password.html?token=${token}`;

    await transporter.sendMail({
      from: "FinLedger <finledger.project@gmail.com>",
      to: user.email,
      subject: "Reset your FinLedger password",
      html: `
        <h3>Password Reset</h3>
        <p>Click below link (valid for 15 minutes):</p>
        <a href="${resetLink}">${resetLink}</a>
      `
    });

    res.json({
      message: "Reset link sent to your email",
      link: resetLink // optional, remove in production
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= RESET PASSWORD =================
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, await bcrypt.genSalt(10));
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: "Password updated successfully. Please login again." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

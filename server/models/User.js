const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  income: { type: Number, default: 0 },

  resetToken: String,
  resetTokenExpiry: Date
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

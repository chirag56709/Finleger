const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

connectDB();

// test route
app.get("/", (req, res) => {
  res.send("FinLedger API running");
});

module.exports = app;

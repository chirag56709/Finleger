const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const authRoutes = require("./routes/auth");


const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);


// connect database
connectDB();

// test route
app.get("/", (req, res) => {
  res.send("FinLedger API running");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

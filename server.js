const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import database connection
const pool = require("./src/config/database");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection on startup
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    console.log("💡 Check your .env file and PostgreSQL password");
  } else {
    console.log("✅ Database connected successfully!");
  }
});

// Simple test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 CeylonConnect Backend is running!",
    timestamp: new Date().toISOString(),
  });
});

// Database test route
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as current_time");
    res.json({
      success: true,
      message: "Database connection successful!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🌐 Test URLs:`);
  console.log(`   http://localhost:${PORT}/`);
  console.log(`   http://localhost:${PORT}/test-db`);
});

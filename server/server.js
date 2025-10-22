const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import database connection and routes
const pool = require("./src/config/database");
const authRoutes = require("./src/routes/authRoutes");
const reviewRoutes = require('./src/routes/reviewRoutes');


const app = express();

// --- Middleware Setup ---

// 1. CORS Configuration: Explicitly allow requests from your frontend
const corsOptions = {
  origin: "http://localhost:5173" || "http://localhost:5174" ,// Use your frontend's actual port
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// 2. Body Parsers: Use the modern, built-in Express parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);



// --- API Routes ---
// Mount the authentication routes at the correct path
app.use("/api/auth", authRoutes);


// --- Server and Database Health Checks ---

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
      time: result.rows[0].current_time,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});


// --- Server Initialization ---

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  // Optional: You can keep the initial DB connection test if you like
  pool.query("SELECT NOW()")
    .then(res => console.log("✅ Database connected successfully!"))
    .catch(err => console.error("❌ Database connection failed:", err.message));
});
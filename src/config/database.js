const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "ceylonconnect",
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Test connection
pool.on("connect", () => {
  console.log("🔗 Attempting to connect to database...");
});

pool.on("error", (err) => {
  console.error("❌ Database connection error:", err.message);
});

module.exports = pool;

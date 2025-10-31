const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for Neon
  },
});

pool.on("connect", () => {
  console.log("✅ Connected to Neon PostgreSQL (pool active)");
});

pool.on("error", (err) => {
  console.error("❌ Database connection error:", err.message);
});

module.exports = pool;

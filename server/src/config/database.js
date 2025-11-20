const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  /*ssl: {
    rejectUnauthorized: false, // required for Neon
  },*/
  ssl: true, // Enforce SSL
});

pool.on("connect", () => {
  console.log("✅ Connected to Neon PostgreSQL (pool active)");
});

pool.on("error", (err) => {
  console.error("❌ Database connection error:", err.message);
});

// Check if connection works immediately
pool
  .connect()
  .then(() => console.log("✅ Connected to Neon PostgreSQL successfully!"))
  .catch((err) => console.error("❌ Database connection failed:", err.message));

module.exports = pool;

const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// ✅ Get all reviews
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reviews ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching reviews:", error.message);
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

// ✅ Add new review
router.post("/", async (req, res) => {
  try {
    const { user_id, comment, rating } = req.body;

    if (!user_id || !comment || !rating) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await pool.query(
      "INSERT INTO reviews (user_id, comment, rating, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
      [user_id, comment, rating]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error adding review:", error.message);
    res.status(500).json({ message: "Error adding review" });
  }
});

module.exports = router;

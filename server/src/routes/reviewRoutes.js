const express = require("express");
const router = express.Router();

// Temporary in-memory review storage
let reviews = [];

// GET all reviews
router.get("/", (req, res) => {
  res.json(reviews);
});

// POST a new review
router.post("/", (req, res) => {
  const { user, comment, rating } = req.body;
  if (!user || !comment || !rating) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newReview = {
    id: reviews.length + 1,
    user,
    comment,
    rating,
    date: new Date()
  };

  reviews.push(newReview);
  res.status(201).json(newReview);
});

module.exports = router;

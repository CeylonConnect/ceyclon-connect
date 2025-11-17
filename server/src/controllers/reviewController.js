const ReviewModel = require("../models/reviewModel");

const reviewController = {
  // ✅ 1. Create review for hotel
  createHotelReview: async (req, res) => {
    try {
      const { hotelId } = req.params;
      const { user_id, rating, review_text } = req.body;

      if (!user_id || !rating || !review_text) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const review = await ReviewModel.createReview(
        parseInt(hotelId),
        parseInt(user_id),
        rating,
        review_text
      );

      res.status(201).json(review);
    } catch (error) {
      console.error("❌ Error creating review:", error.message);
      res.status(500).json({ message: "Failed to create review" });
    }
  },

  // ✅ 2. Get all reviews for hotel
  getAllHotelReviews: async (req, res) => {
    try {
      const { hotelId } = req.params;
      const reviews = await ReviewModel.getReviewsByHotel(parseInt(hotelId));
      res.json(reviews);
    } catch (error) {
      console.error("❌ Error fetching reviews:", error.message);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  },

  // ✅ 3. Get single review
  getHotelReviewById: async (req, res) => {
    try {
      const { reviewId } = req.params;
      const review = await ReviewModel.getReviewById(parseInt(reviewId));
      if (!review) return res.status(404).json({ message: "Review not found" });
      res.json(review);
    } catch (error) {
      console.error("❌ Error fetching review:", error.message);
      res.status(500).json({ message: "Failed to fetch review" });
    }
  },

  // ✅ 4. Update review
  updateHotelReview: async (req, res) => {
    try {
      const { reviewId } = req.params;
      const data = req.body;
      const updated = await ReviewModel.updateReview(parseInt(reviewId), data);
      res.json(updated);
    } catch (error) {
      console.error("❌ Error updating review:", error.message);
      res.status(500).json({ message: "Failed to update review" });
    }
  },

  // ✅ 5. Delete review
  deleteHotelReview: async (req, res) => {
    try {
      const { reviewId } = req.params;
      await ReviewModel.deleteReview(parseInt(reviewId));
      res.json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("❌ Error deleting review:", error.message);
      res.status(500).json({ message: "Failed to delete review" });
    }
  },
};

module.exports = reviewController;

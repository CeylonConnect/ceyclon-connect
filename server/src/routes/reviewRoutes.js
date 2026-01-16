
import express from "express";
import {
  createReview,
  getReviewsByTour,
  getReviewsByGuide,
  getAverageRating,
  getGuideAverageRating,
  getReviewStats,
} from "../controllers/reviewController.js";
import {
  protect,
  requireRole,
  requireAdmin,
} from "../../middleware/authMiddleware.js";

const router = express.Router();

// Create a new review (tourist only)
router.post("/", protect, requireRole("tourist"), createReview);

// Get all reviews for a specific tour
router.get("/tour/:tourId", getReviewsByTour);

// Get all reviews for a specific guide
router.get("/guide/:guideId", getReviewsByGuide);

// Get average rating for a specific tour
router.get("/tour/:tourId/average", getAverageRating);

// Get average rating for a specific guide
router.get("/guide/:guideId/average", getGuideAverageRating);

// Get overall platform review stats (Admin)
router.get("/stats/overview", protect, requireAdmin, getReviewStats);

export default router;

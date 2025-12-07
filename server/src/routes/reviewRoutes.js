import express from "express";
import {createReview, getReviewsByTour, getReviewsByGuide,
 getAverageRating, getGuideAverageRating,
  getReviewStats, }from "../controllers/reviewController.js";

const router = express.Router();

//  Create a new review
router.post("/", createReview);
//  Get all reviews for a specific tour
router.get("/tour/:tourId", getReviewsByTour);

//  Get all reviews for a specific guide
router.get("/guide/:guideId", getReviewsByGuide);

//  Get average rating for a specific tour
router.get("/tour/:tourId/average", getAverageRating);

//  Get average rating for a specific guide
router.get("/guide/:guideId/average", getGuideAverageRating);

//  Get overall platform review stats (Admin)
router.get("/stats/overview", getReviewStats);

export default router;

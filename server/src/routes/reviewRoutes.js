import express from "express";
import {createReview, getReviewsByTour, getReviewsByGuide,
  getAverageRating,}from "../controllers/reviewController.js";
const router = express.Router();

//  Create a new review
router.post("/", createReview);

//  Get all reviews for a specific tour
router.get("/tour/:tourId", getReviewsByTour);

//  Get all reviews for a specific guide
router.get("/guide/:guideId", getReviewsByGuide);

//  Get average rating for a specific tour
router.get("/tour/:tourId/average", getAverageRating);

export default router;

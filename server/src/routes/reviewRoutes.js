import express from "express";
import {createReview, getReviewsByTour,}from "../controllers/reviewController.js";
const router = express.Router();

//  Create a new review
router.post("/", createReview);

//  Get all reviews for a specific tour
router.get("/tour/:tourId", getReviewsByTour);

export default router;

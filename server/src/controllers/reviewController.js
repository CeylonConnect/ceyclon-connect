import Review from "../models/reviewModel.js";



  //  Create a new review
export const createReview = async (req, res) => {
  try {
    const reviewData = req.body;
    const newReview = await Review.create(reviewData);
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error.message);
    res.status(400).json({ error: error.message });
  }
};

  //  Get reviews by tour ID
export const getReviewsByTour = async (req, res) => {
  try {
    const { tourId } = req.params;
    const reviews = await Review.findByTourId(tourId);
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching tour reviews:", error);
    res.status(500).json({ error: "Failed to fetch tour reviews" });
  }
};

//  Get reviews by guide ID (local provider)
export const getReviewsByGuide = async (req, res) => {
  try {
    const { guideId } = req.params;
    const reviews = await Review.findByGuideId(guideId);
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching guide reviews:", error);
    res.status(500).json({ error: "Failed to fetch guide reviews" });
  }
};

// ✅ Get average rating for a specific tour
export const getAverageRating = async (req, res) => {
  try {
    const { tourId } = req.params;
    const stats = await Review.getAverageRating(tourId);
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching average rating:", error);
    res.status(500).json({ error: "Failed to fetch average rating" });
  }
};

//  Get average rating for a guide
export const getGuideAverageRating = async (req, res) => {
  try {
    const { guideId } = req.params;
    const stats = await Review.getGuideAverageRating(guideId);
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching guide average rating:", error);
    res.status(500).json({ error: "Failed to fetch guide rating" });
  }
};

//  Get platform-wide review statistics (Admin use)
export const getReviewStats = async (req, res) => {
  try {
    const stats = await Review.getReviewStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching review stats:", error);
    res.status(500).json({ error: "Failed to fetch review statistics" });
  }
};
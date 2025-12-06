import express from "express";
import {
  getPlatformStats,
  getBookingStats,
  getPopularTours,
} from "../controllers/adminController.js";

const router = express.Router();
// Platform stats
router.get("/stats/platform", getPlatformStats);

// Booking stats (optional timeframe: week, month, year)
router.get("/stats/bookings", getBookingStats);

// Popular tours
router.get("/stats/popular-tours", getPopularTours);

export default router;

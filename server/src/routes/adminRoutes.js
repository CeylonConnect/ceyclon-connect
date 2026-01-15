import express from "express";
import {
  getPlatformStats,
  getBookingStats,
  getPopularTours,
  getUsers,
  setUserBlocked,
  unblockAllUsers,
} from "../controllers/adminController.js";

import { protect, requireAdmin } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Admin-only routes
router.use(protect, requireAdmin);

// Platform stats
router.get("/stats/platform", getPlatformStats);

// Booking stats (optional timeframe: week, month, year)
router.get("/stats/bookings", getBookingStats);

// Popular tours
router.get("/stats/popular-tours", getPopularTours);

// Users
router.get("/users", getUsers);
router.patch("/users/unblock-all", unblockAllUsers);
router.patch("/users/:id/block", setUserBlocked);

export default router;
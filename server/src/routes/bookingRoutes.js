import express from "express";
import {
  createBooking,
  getBookingById,
  getBookingsByTourist,
  getBookingsByProvider,
  updateBookingStatus,
  getAllBookings,
} from "../controllers/bookingController.js";
import {
  protect,
  requireAdmin,
  requireRole,
} from "../../middleware/authMiddleware.js";

const router = express.Router();

// Create booking (tourist only)
router.post("/", protect, requireRole("tourist"), createBooking);

// Get all bookings (admin only)
router.get("/", protect, requireAdmin, getAllBookings);

// Get bookings by tourist (self or admin)
router.get("/tourist/:touristId", protect, getBookingsByTourist);

// Get bookings by provider (self local only)
router.get(
  "/provider/:providerId",
  protect,
  requireRole("local", "guide"),
  getBookingsByProvider
);

// Get booking by ID (admin only for now)
router.get("/:id", protect, requireAdmin, getBookingById);

// Update booking status (provider only)
router.put(
  "/:id/status",
  protect,
  requireRole("local", "guide"),
  updateBookingStatus
);
router.patch(
  "/:id/status",
  protect,
  requireRole("local", "guide"),
  updateBookingStatus
);

export default router;
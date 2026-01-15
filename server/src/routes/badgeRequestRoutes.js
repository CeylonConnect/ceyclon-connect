import express from "express";
import {
  createBadgeRequest,
  getBadgeRequestById,
  getUserBadgeRequests,
  getMyBadgeRequests,
  getAllBadgeRequests,
  updateBadgeRequestStatus,
  getBadgeRequestStats,
} from "../controllers/badgeRequestController.js";

import { protect, requireAdmin } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Current user's requests
router.get("/me", protect, getMyBadgeRequests);

// Get all badge requests of a user
router.get("/user/:userId", protect, getUserBadgeRequests);

// Get badge request stats (admin)
router.get("/stats", protect, requireAdmin, getBadgeRequestStats);

// Create a new badge request (user)
router.post("/", protect, createBadgeRequest);

// Get a badge request by ID
router.get("/:id", protect, requireAdmin, getBadgeRequestById);

// Get all badge requests (admin) with optional status filter
router.get("/", protect, requireAdmin, getAllBadgeRequests);

// Update badge request status (admin)
router.put("/:id/status", protect, requireAdmin, updateBadgeRequestStatus);

export default router;
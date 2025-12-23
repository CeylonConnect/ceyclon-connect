import express from "express";
import {
  createBadgeRequest,
  getBadgeRequestById,
  getUserBadgeRequests,
  getAllBadgeRequests,
  updateBadgeRequestStatus,
  getBadgeRequestStats,
} from "../controllers/badgeRequestController.js";

const router = express.Router();
// Get all badge requests of a user
router.get("/user/:userId", getUserBadgeRequests);


// Get badge request stats (admin)
router.get("/stats", getBadgeRequestStats);

// Create a new badge request (user)
router.post("/", createBadgeRequest);

// Get a badge request by ID
router.get("/:id", getBadgeRequestById);

// Get all badge requests (admin) with optional status filter
router.get("/", getAllBadgeRequests);

// Update badge request status (admin)
router.put("/:id/status", updateBadgeRequestStatus);

export default router;

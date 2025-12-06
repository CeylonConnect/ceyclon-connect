import express from "express";
import {
  createBadgeRequest,
  getBadgeRequestById,
  getUserBadgeRequests,
  getAllBadgeRequests,
  updateBadgeRequestStatus,
  getBadgeRequestStats,
} from "../controllers/badgeRequestController.js";

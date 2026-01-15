import express from "express";
import {
  createDispute,
  getDisputeById,
  getAllDisputes,
  updateDispute,
  deleteDispute,
} from "../controllers/disputeController.js";
import { protect, requireAdmin } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Create dispute: logged-in user involved in the booking (tourist/local)
router.post("/", protect, createDispute);

// Logged-in user disputes
router.get("/mine", protect, getAllDisputes);

// Admin only: all disputes
router.get("/", protect, requireAdmin, getAllDisputes);

// Admin or involved user
router.get("/:id", protect, getDisputeById);

// Admin actions
router.put("/:id", protect, requireAdmin, updateDispute);
router.delete("/:id", protect, requireAdmin, deleteDispute);

export default router;
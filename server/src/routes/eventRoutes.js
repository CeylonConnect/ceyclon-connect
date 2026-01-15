import express from "express";
import {
  createEvent,
  getEventById,
  getAllEvents,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { protect, requireAdmin } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, requireAdmin, createEvent);
router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.put("/:id", protect, requireAdmin, updateEvent);
router.delete("/:id", protect, requireAdmin, deleteEvent);

export default router;
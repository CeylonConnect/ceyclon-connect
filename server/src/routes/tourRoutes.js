import express from "express";
import {
  createTour,
  getAllTours,
  getTourById,
  getToursByProvider,
  updateTour,
  deleteTour,
  getToursByDistrict,
} from "../controllers/tourController.js";

import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTour);
router.get("/", getAllTours);
router.get("/provider/:providerId", getToursByProvider);
router.get("/districts/grouped", getToursByDistrict);
router.get("/:id", getTourById);
router.put("/:id", protect, updateTour);
router.delete("/:id", protect, deleteTour);

export default router;
import express from "express";
import {
  createTour,
  getAllTours,
  getTourById,
  getToursByProvider,
  updateTour,
  deleteTour,
  getToursByDistrict
} from "../controllers/tourController.js";
const router = express.Router();


router.post("/", createTour);
router.get("/", getAllTours);
router.get("/:id", getTourById);
router.get("/provider/:providerId", getToursByProvider);
router.put("/:id", updateTour);
router.delete("/:id", deleteTour);
router.get("/districts/grouped", getToursByDistrict);

export default router;

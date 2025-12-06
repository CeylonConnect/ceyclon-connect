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

import express from "express";
import {
  createDispute,
  getDisputeById,
  getAllDisputes,
  updateDispute,
  deleteDispute,
} from "../controllers/disputeController.js";

const router = express.Router();

router.post("/", createDispute);
router.get("/", getAllDisputes);
router.get("/:id", getDisputeById);
router.put("/:id", updateDispute);
router.delete("/:id", deleteDispute);

export default router;

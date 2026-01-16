import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import {
  chatAssistant,
  generateDescription,
} from "../controllers/aiController.js";

const router = express.Router();

// POST /api/ai/description
router.post("/description", protect, generateDescription);

// POST /api/ai/chat (public)
router.post("/chat", chatAssistant);

export default router;
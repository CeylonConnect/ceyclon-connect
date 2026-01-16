
import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import {
  getCloudinarySignature,
  getPublicCloudinarySignature,
} from "../controllers/uploadController.js";

const router = express.Router();

// Returns { cloudName, apiKey, timestamp, folder, signature }
router.get("/cloudinary-signature", protect, getCloudinarySignature);

// Public signature endpoint for signup/profile image upload.
// Restricts folder to "profiles" to limit scope.
router.get("/cloudinary-signature/public", getPublicCloudinarySignature);

export default router;

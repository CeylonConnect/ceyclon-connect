import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  getAllUsers,
  getUserById,
  getUserLastSeen,
  updateUser,
} from "../controllers/userController.js";

import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Validate that any :id used in this router is numeric (MySQL user_id).
// This prevents paths like /users/me from ever reaching DB queries.
router.param("id", (req, res, next, id) => {
  const ok = /^\d+$/.test(String(id));
  if (!ok) {
    return res.status(400).json({ message: "Invalid user id" });
  }
  next();
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.get("/", getAllUsers);
router.get("/:id/last-seen", protect, getUserLastSeen);
router.get("/:id", getUserById);
router.put("/:id", protect, updateUser);

export default router;
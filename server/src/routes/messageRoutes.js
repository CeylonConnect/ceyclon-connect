import express from "express";
import {
  sendMessage,
  getConversation,
  getUserConversations,
  markMessageAsRead,
  markConversationAsRead,
  getUnreadCount,
} from "../controllers/messageController.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Send a new message
router.post("/", protect, sendMessage);

// Get conversation between two users (optional booking filter)
router.get("/conversation/:user1Id/:user2Id", protect, getConversation);

// Mark all messages from other user as read
router.patch(
  "/conversation/:otherUserId/read",
  protect,
  markConversationAsRead
);

// Get all conversations for a user (last message preview)
router.get("/user/:userId", protect, getUserConversations);

// Aliases for older frontend clients
router.get("/conversations/:userId", protect, getUserConversations);

// Mark message as read
router.put("/:messageId/read", protect, markMessageAsRead);
router.patch("/:messageId/read", protect, markMessageAsRead);

// Get unread message count for a user
router.get("/user/:userId/unread-count", protect, getUnreadCount);
router.get("/unread/:userId", protect, getUnreadCount);

export default router;

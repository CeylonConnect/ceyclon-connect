import express from "express";
import {
  sendMessage,
  getConversation,
  getUserConversations,
  markMessageAsRead,
  getUnreadCount,
} from "../controllers/messageController.js";

const router = express.Router();


// ✅ Send a new message
router.post("/", sendMessage);


// ✅ Get conversation between two users (optional booking filter)
router.get("/conversation/:user1Id/:user2Id", getConversation);


// ✅ Get all conversations for a user (last message preview)
router.get("/user/:userId", getUserConversations);

// ✅ Mark message as read
router.put("/:messageId/read", markMessageAsRead);

// ✅ Get unread message count for a user
router.get("/user/:userId/unread-count", getUnreadCount);

export default router;

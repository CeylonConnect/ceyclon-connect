import express from "express";
import {
  sendMessage,
  getConversation,
  getUserConversations,
  markMessageAsRead,
  getUnreadCount,
} from "../controllers/messageController.js";

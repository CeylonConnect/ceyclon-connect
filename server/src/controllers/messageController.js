import Message from "../models/messageModel.js";

//Send a new message
export const sendMessage = async (req, res) => {
  try {
    const messageData = req.body;
    const newMessage = await Message.create(messageData);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get conversation between two users (optional booking filter)
export const getConversation = async (req, res) => {
  try {
    const { user1Id, user2Id } = req.params;
    const { bookingId } = req.query;
    const conversation = await Message.getConversation(user1Id, user2Id, bookingId);
    res.status(200).json(conversation);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ error: error.message });
  }
};



//Get all conversations for a user (last message preview)
export const getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;
    const conversations = await Message.getUserConversations(userId);
    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error fetching user conversations:", error);
    res.status(500).json({ error: error.message });
  }
};



//Mark a message as read
export const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const updatedMessage = await Message.markAsRead(messageId);
    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({ error: error.message });
  }
};



//Get unread message count for a user
export const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;
    const unreadCount = await Message.getUnreadCount(userId);
    res.status(200).json({ unread_count: unreadCount });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({ error: error.message });
  }
};




import Message from "../models/messageModel.js";

// ✅ Send a new message
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

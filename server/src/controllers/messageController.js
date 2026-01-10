import Message from "../models/messageModel.js";
import pusher from "../config/pusher.js";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";

function toConversationId(userA, userB) {
  const a = Number(userA);
  const b = Number(userB);
  const parts = [a, b].sort((x, y) => x - y);
  return `${parts[0]}_${parts[1]}`;
}

//Send a new message
export const sendMessage = async (req, res) => {
  try {
    const senderId = Number(req.user?.user_id);
    if (!Number.isFinite(senderId)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const receiverId = Number(req.body?.receiver_id ?? req.body?.receiverId);
    if (!Number.isFinite(receiverId)) {
      return res.status(400).json({ error: "Invalid receiver_id" });
    }
    if (receiverId === senderId) {
      return res.status(400).json({ error: "receiver_id must be different" });
    }

    const bookingIdRaw = req.body?.booking_id ?? req.body?.bookingId ?? null;
    const bookingId = bookingIdRaw == null ? null : Number(bookingIdRaw);
    if (bookingIdRaw != null && !Number.isFinite(bookingId)) {
      return res.status(400).json({ error: "Invalid booking_id" });
    }

    const messageText = String(
      req.body?.message_text ?? req.body?.messageText ?? req.body?.text ?? ""
    ).trim();
    if (!messageText) {
      return res.status(400).json({ error: "message_text is required" });
    }

    const messageData = {
      sender_id: senderId,
      receiver_id: receiverId,
      booking_id: bookingId,
      message_text: messageText,
    };

    const newMessage = await Message.create(messageData);

    // Notifications: message received (local/tourist)
    try {
      const receiver = await User.findById(receiverId);
      const receiverRole = String(receiver?.role || "tourist")
        .toLowerCase()
        .trim();
      const dash =
        receiverRole === "admin"
          ? "/admin"
          : receiverRole === "local" || receiverRole === "guide"
          ? "/local"
          : "/dashboard";
      await Notification.create({
        user_id: receiverId,
        type: "message_received",
        title: "New message",
        message: "You have received a new message.",
        link: `${dash}?tab=messages&chat=${senderId}`,
        metadata: {
          sender_id: senderId,
          receiver_id: receiverId,
          booking_id: bookingId,
          message_id: newMessage?.message_id,
        },
      });
    } catch {
      // don't block messaging flow
    }

    if (pusher) {
      const conversationId = toConversationId(senderId, receiverId);
      const channel = `private-chat-${conversationId}`;
      pusher.trigger(channel, "message:new", {
        message: newMessage,
      });
    }

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
    const me = Number(req.user?.user_id);
    const u1 = Number(user1Id);
    const u2 = Number(user2Id);
    const isAdmin = String(req.user?.role || "").toLowerCase() === "admin";
    if (!isAdmin && me !== u1 && me !== u2) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { bookingId } = req.query;
    const conversation = await Message.getConversation(
      user1Id,
      user2Id,
      bookingId
    );
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
    const me = Number(req.user?.user_id);
    const target = Number(userId);
    const isAdmin = String(req.user?.role || "").toLowerCase() === "admin";
    if (!isAdmin && me !== target) {
      return res.status(403).json({ error: "Forbidden" });
    }

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




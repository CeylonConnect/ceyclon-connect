import Notification from "../models/notificationModel.js";

export const listNotifications = async (req, res) => {
  try {
    const userId = Number(req.user?.user_id);
    if (!Number.isFinite(userId)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const unreadOnly =
      String(req.query?.unreadOnly || req.query?.unread || "").toLowerCase() ===
        "true" ||
      String(req.query?.unreadOnly || req.query?.unread || "") === "1";

    const limit = Number(req.query?.limit ?? 10);
    const offset = Number(req.query?.offset ?? 0);

    const rows = await Notification.listForUser(userId, {
      unreadOnly,
      limit,
      offset,
    });

    res.json(rows);
  } catch (error) {
    console.error("Error listing notifications:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const userId = Number(req.user?.user_id);
    if (!Number.isFinite(userId)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const unread_count = await Notification.getUnreadCount(userId);
    res.json({ unread_count });
  } catch (error) {
    console.error("Error getting unread notification count:", error);
    res.status(500).json({ error: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const userId = Number(req.user?.user_id);
    if (!Number.isFinite(userId)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const id = Number(req.params?.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const updated = await Notification.markRead(userId, id);
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (error) {
    console.error("Error marking notification read:", error);
    res.status(500).json({ error: error.message });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    const userId = Number(req.user?.user_id);
    if (!Number.isFinite(userId)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await Notification.markAllRead(userId);
    res.json(result);
  } catch (error) {
    console.error("Error marking all notifications read:", error);
    res.status(500).json({ error: error.message });
  }
};

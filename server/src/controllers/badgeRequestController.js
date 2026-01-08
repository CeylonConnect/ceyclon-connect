import BadgeRequest from "../models/badgeModel.js";
import User from "../models/userModel.js";
import Notification from "../models/notificationModel.js";

// Create a new badge request
export const createBadgeRequest = async (req, res) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const dbUser = await User.findById(userId);
    const role = (dbUser?.role || req.user?.role || "")
      .toString()
      .toLowerCase();
    const badgeStatus = (dbUser?.badge_status || "none")
      .toString()
      .toLowerCase();

    if (role !== "local" && role !== "guide") {
      return res
        .status(403)
        .json({ error: "Only local guides can request verification" });
    }

    if (badgeStatus === "verified") {
      return res.status(400).json({ error: "You are already verified" });
    }

    if (badgeStatus === "pending") {
      return res
        .status(400)
        .json({ error: "Your badge request is already pending" });
    }

    const { document_urls } = req.body;
    if (!Array.isArray(document_urls) || document_urls.length === 0) {
      return res
        .status(400)
        .json({ error: "document_urls must be a non-empty array" });
    }

    const newRequest = await BadgeRequest.create({
      user_id: userId,
      document_urls,
    });

    // Admin notification: badge verification request submitted
    try {
      await Notification.createForRole("admin", {
        type: "badge_request_submitted",
        title: "New badge verification request",
        message: "A local guide submitted a badge verification request.",
        link: "/admin?tab=badge",
        metadata: { request_id: newRequest?.request_id, user_id: userId },
      });
    } catch {
      // ignore
    }

    await User.updateBadgeStatus(userId, "pending");
    res.status(201).json(newRequest);
  } catch (error) {
    console.error("Error creating badge request:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get a badge request by ID
export const getBadgeRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await BadgeRequest.findById(id);
    if (!request)
      return res.status(404).json({ error: "Badge request not found" });
    res.json(request);
  } catch (error) {
    console.error("Error getting badge request:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all badge requests for a user
export const getUserBadgeRequests = async (req, res) => {
  try {
    const { userId } = req.params;
    const requesterId = req.user?.user_id;
    const requesterRole = (req.user?.role || "").toString().toLowerCase();

    if (!requesterId) return res.status(401).json({ error: "Unauthorized" });
    if (requesterRole !== "admin" && Number(userId) !== Number(requesterId)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const requests = await BadgeRequest.findByUserId(userId);
    res.json(requests);
  } catch (error) {
    console.error("Error getting user badge requests:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get current user's badge requests
export const getMyBadgeRequests = async (req, res) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const requests = await BadgeRequest.findByUserId(userId);
    res.json(requests);
  } catch (error) {
    console.error("Error getting my badge requests:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all badge requests (admin)
export const getAllBadgeRequests = async (req, res) => {
  try {
    const { status } = req.query; // optional filter by status
    const requests = await BadgeRequest.getAllRequests(status);
    res.json(requests);
  } catch (error) {
    console.error("Error getting all badge requests:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get badge request stats
export const getBadgeRequestStats = async (req, res) => {
  try {
    const stats = await BadgeRequest.getStats();
    res.json(stats);
  } catch (error) {
    console.error("Error getting badge request stats:", error);
    res.status(500).json({ error: error.message });
  }
};

import BadgeRequest from "../models/badgeModel.js";

// Create a new badge request
export const createBadgeRequest = async (req, res) => {
  try {
    const { user_id, document_urls } = req.body;
    const newRequest = await BadgeRequest.create({ user_id, document_urls });
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
    const requests = await BadgeRequest.findByUserId(userId);
    res.json(requests);
  } catch (error) {
    console.error("Error getting user badge requests:", error);
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

// Update badge request status (admin)
export const updateBadgeRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewedBy, adminNotes } = req.body;
    const updatedRequest = await BadgeRequest.updateStatus(
      id,
      status,
      reviewedBy,
      adminNotes
    );
    res.json(updatedRequest);
  } catch (error) {
    console.error("Error updating badge request:", error);
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


import Admin from "../models/adminModel.js";

// Get overall platform stats
export const getPlatformStats = async (req, res) => {
  try {
    const stats = await Admin.getPlatformStats();
    res.json(stats);
  } catch (error) {
    console.error("Error getting platform stats:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get booking stats (daily) with timeframe filter: week, month, year
export const getBookingStats = async (req, res) => {
  try {
    const { timeframe } = req.query; // optional query param
    const stats = await Admin.getBookingStats(timeframe);
    res.json(stats);
  } catch (error) {
    console.error("Error getting booking stats:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get popular tours by bookings
export const getPopularTours = async (req, res) => {
  try {
    const { limit } = req.query; // optional query param
    const tours = await Admin.getPopularTours(limit || 10);
    res.json(tours);
  } catch (error) {
    console.error("Error getting popular tours:", error);
    res.status(500).json({ error: error.message });
  }
};

// Admin: list users (optional filters: role, q)
export const getUsers = async (req, res) => {
  try {
    const role = req.query?.role || null;
    const q = req.query?.q || null;
    const users = await User.getAllUsers(role, q);
    res.json(users);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: error.message });
  }
};

// Admin: block/unblock user (blocked=true => is_verified=false)
export const setUserBlocked = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (!Number.isFinite(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const blocked = Boolean(req.body?.blocked);
    const updated = await User.setIsVerified(userId, !blocked);
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json({
      message: blocked ? "User blocked" : "User unblocked",
      user: updated,
    });
  } catch (error) {
    console.error("Error updating user block status:", error);
    res.status(500).json({ error: error.message });
  }
};

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

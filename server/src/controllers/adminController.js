
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

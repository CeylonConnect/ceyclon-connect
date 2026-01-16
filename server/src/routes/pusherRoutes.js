
import express from "express";
import pusher from "../config/pusher.js";
import Booking from "../models/bookingModel.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

function parseConversationChannel(channelName) {
  // expected: private-chat-<a>_<b> or private-chat-<a>-<b>
  const prefix = "private-chat-";
  if (!channelName?.startsWith(prefix)) return null;
  const rest = channelName.slice(prefix.length);
  const parts = rest.includes("_") ? rest.split("_") : rest.split("-");
  if (parts.length !== 2) return null;
  const a = Number(parts[0]);
  const b = Number(parts[1]);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return { a, b };
}

// Pusher private channel auth
router.post("/auth", protect, async (req, res) => {
  try {
    if (!pusher) {
      return res.status(500).json({ error: "Pusher not configured" });
    }

    const { socket_id: socketId, channel_name: channelName } = req.body || {};
    if (!socketId || !channelName) {
      return res
        .status(400)
        .json({ error: "Missing socket_id or channel_name" });
    }

    // Only allow auth for channels that include the current user.
    const parsed = parseConversationChannel(channelName);
    if (!parsed) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const me = Number(req.user?.user_id);
    if (!Number.isFinite(me) || (me !== parsed.a && me !== parsed.b)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const auth = pusher.authorizeChannel(socketId, channelName, {
      user_id: String(me),
    });

    return res.json(auth);
  } catch (e) {
    console.error("Pusher auth error", e);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;

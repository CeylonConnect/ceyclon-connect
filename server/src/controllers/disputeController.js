import { Dispute } from "../models/disputeModel.js";
import Booking from "../models/bookingModel.js";
import Notification from "../models/notificationModel.js";

export const createDispute = async (req, res) => {
  try {
    const userId = Number(req.user?.user_id);
    if (!Number.isFinite(userId)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const bookingId = Number(req.body?.booking_id ?? req.body?.bookingId);
    if (!Number.isFinite(bookingId)) {
      return res.status(400).json({ error: "booking_id is required" });
    }

    const type = String(req.body?.type || "general").slice(0, 50);
    const description = String(req.body?.description || "").trim();
    if (!description) {
      return res.status(400).json({ error: "description is required" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const touristId = Number(booking.tourist_id);
    const providerId = Number(booking.provider_id);
    const isTourist = Number.isFinite(touristId) && userId === touristId;
    const isProvider = Number.isFinite(providerId) && userId === providerId;

    if (!isTourist && !isProvider) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const complainant_id = userId;
    const accused_id = isTourist ? providerId : touristId;
    if (!Number.isFinite(accused_id)) {
      return res.status(400).json({ error: "Invalid booking participants" });
    }

    const dispute = await Dispute.create({
      booking_id: bookingId,
      complainant_id,
      accused_id,
      type,
      description,
    });

    // Admin notification: dispute submitted
    try {
      await Notification.createForRole("admin", {
        type: "dispute_submitted",
        title: "New dispute submitted",
        message: `A new dispute was submitted for booking #${bookingId}.`,
        link: "/admin?tab=disputes",
        metadata: { dispute_id: dispute?.dispute_id, booking_id: bookingId },
      });
    } catch {
      // ignore
    }

    res.status(201).json(dispute);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDisputeById = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) return res.status(404).json({ error: "Dispute not found" });

    const userId = Number(req.user?.user_id);
    const role = String(req.user?.role || "").toLowerCase();
    const isAdmin = role === "admin";
    const involved =
      userId &&
      (Number(dispute.complainant_id) === userId ||
        Number(dispute.accused_id) === userId);

    if (!isAdmin && !involved) {
      return res.status(403).json({ error: "Forbidden" });
    }
    res.json(dispute);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllDisputes = async (req, res) => {
  try {
    // If this handler is mounted at /disputes/mine, return user-specific disputes.
    if (req.path === "/mine") {
      const userId = Number(req.user?.user_id);
      if (!Number.isFinite(userId)) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const disputes = await Dispute.getMine(userId);
      return res.json(disputes);
    }

    const disputes = await Dispute.getAll(req.query);
    return res.json(disputes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDispute = async (req, res) => {
  try {
    const before = await Dispute.findById(req.params.id);
    const dispute = await Dispute.update(req.params.id, req.body);

    // Tourist/local notification: dispute resolution/status update
    try {
      const complainantId = Number(before?.complainant_id);
      const accusedId = Number(before?.accused_id);
      const ids = [complainantId, accusedId].filter((n) => Number.isFinite(n));
      const uniqueIds = Array.from(new Set(ids));

      const status = String(dispute?.status || req.body?.status || "update")
        .toLowerCase()
        .trim();

      await Promise.all(
        uniqueIds.map(async (uid) => {
          return Notification.create({
            user_id: uid,
            type: "dispute_updated",
            title: "Dispute updated",
            message: `Your dispute status is now: ${status}.`,
            link: "/help-center",
            metadata: { dispute_id: dispute?.dispute_id },
          });
        })
      );
    } catch {
      // ignore
    }

    res.json({
      message: "Message Update Successfully",
      dispute: dispute,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteDispute = async (req, res) => {
  try {
    const dispute = await Dispute.delete(req.params.id);

    if (!dispute) {
      return res.status(404).json({ error: "Dispute not found" });
    }

    res.json({ message: "Dispute deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
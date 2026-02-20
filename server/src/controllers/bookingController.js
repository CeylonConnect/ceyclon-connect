import Booking from "../models/bookingModel.js";
import Tour from "../models/tourModel.js";
import Notification from "../models/notificationModel.js";

// ✅ Create a new booking
export const createBooking = async (req, res) => {
  try {
    const touristId = req.user?.user_id;
    if (!touristId) return res.status(401).json({ error: "Unauthorized" });

    const tourId = Number(
      req.body?.tour_id ?? req.body?.tourId ?? req.body?.tour
    );
    if (!Number.isFinite(tourId)) {
      return res.status(400).json({ error: "Invalid tour_id" });
    }

    const tourDate =
      req.body?.tour_date ?? req.body?.tourDate ?? req.body?.date;
    if (!tourDate)
      return res.status(400).json({ error: "tour_date is required" });

    const groupSizeRaw =
      req.body?.group_size ?? req.body?.groupSize ?? req.body?.guests;
    const groupSize = Math.max(1, Number(groupSizeRaw || 1));
    if (!Number.isFinite(groupSize)) {
      return res.status(400).json({ error: "Invalid group_size" });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).json({ error: "Tour not found" });

    const unitPrice = Number(tour.price || 0);
    const totalAmount = unitPrice * groupSize;

    const payload = {
      tourist_id: touristId,
      tour_id: tourId,
      tour_date: tourDate,
      group_size: groupSize,
      total_amount: totalAmount,
      special_requests:
        req.body?.special_requests ?? req.body?.specialRequests ?? null,
    };

    const newBooking = await Booking.create(payload);
    // Return a joined row for immediate UI rendering
    const hydrated = await Booking.findById(newBooking.booking_id);

    // Local notification: booking created by tourist
    try {
      const row = hydrated || newBooking;
      const providerId = Number(row?.provider_id);
      if (Number.isFinite(providerId)) {
        const touristName = `${row?.tourist_first_name || ""} ${
          row?.tourist_last_name || ""
        }`.trim();
        const tourTitle = row?.tour_title || tour?.title || "your tour";
        await Notification.create({
          user_id: providerId,
          type: "booking_created",
          title: "New booking request",
          message: `${
            touristName || "A tourist"
          } requested a booking for ${tourTitle}.`,
          link: "/local?tab=bookings",
          metadata: {
            booking_id: row?.booking_id,
            tour_id: row?.tour_id,
            tourist_id: row?.tourist_id,
          },
        });
      }
    } catch (e) {
      // don't block booking flow
    }

    res.status(201).json(hydrated || newBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get bookings by tourist
export const getBookingsByTourist = async (req, res) => {
  try {
    const touristId = Number(req.params.touristId);
    if (!Number.isFinite(touristId)) {
      return res.status(400).json({ error: "Invalid tourist id" });
    }

    const isAdmin = String(req.user?.role || "").toLowerCase() === "admin";
    const isSelf = Number(req.user?.user_id) === touristId;
    if (!isAdmin && !isSelf)
      return res.status(403).json({ error: "Forbidden" });

    const bookings = await Booking.findByTourist(touristId);
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching tourist bookings:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get bookings by provider
export const getBookingsByProvider = async (req, res) => {
  try {
    const bookings = await Booking.findByProvider(req.params.providerId);
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching provider bookings:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedBooking = await Booking.updateStatus(req.params.id, status);

    if (!updatedBooking)
      return res.status(404).json({ error: "Booking not found" });
    res.json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all bookings (with optional filters)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.getAllBookings(req.query);
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    res.status(500).json({ error: error.message });
  }
};

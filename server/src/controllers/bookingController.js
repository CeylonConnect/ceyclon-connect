import Booking from "../models/bookingModel.js";

// ✅ Create a new booking
export const createBooking = async (req, res) => {
  try {
    const newBooking = await Booking.create(req.body);
    res.status(201).json(newBooking);
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
    const bookings = await Booking.findByTourist(req.params.touristId);
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

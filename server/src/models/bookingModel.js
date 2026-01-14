import pool from "../config/database.js";

const Booking = {
  async create(bookingData) {
    try {
      const {
        tourist_id,
        tour_id,
        tour_date,
        group_size,
        total_amount,
        special_requests,
      } = bookingData;

      const insert = await pool.query(
        "INSERT INTO bookings (tourist_id, tour_id, tour_date, group_size, total_amount, special_requests) VALUES (?, ?, ?, ?, ?, ?)",
        [
          tourist_id,
          tour_id,
          tour_date,
          group_size,
          total_amount,
          special_requests,
        ]
      );
      const created = await pool.query(
        "SELECT * FROM bookings WHERE booking_id = ?",
        [insert.insertId]
      );
      return created.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async findById(bookingId) {
    try {
      const query = `
        SELECT b.*, t.title as tour_title, t.price, t.location, t.provider_id,
               guide.first_name as guide_first_name, guide.last_name as guide_last_name, guide.email as guide_email,
               tourist.first_name as tourist_first_name, tourist.last_name as tourist_last_name, tourist.email as tourist_email
        FROM bookings b
        JOIN tours t ON b.tour_id = t.tour_id
        JOIN users guide ON t.provider_id = guide.user_id
        JOIN users tourist ON b.tourist_id = tourist.user_id
        WHERE b.booking_id = ?
      `;
      const result = await pool.query(query, [bookingId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async findByTourist(touristId) {
    try {
      const query = `
        SELECT b.*, t.title, t.location, t.images, t.category, t.provider_id,
               guide.user_id as guide_id,
               guide.first_name as guide_first_name, guide.last_name as guide_last_name,
               guide.profile_picture as guide_avatar,
               guide.badge_status
        FROM bookings b
        JOIN tours t ON b.tour_id = t.tour_id
        JOIN users guide ON t.provider_id = guide.user_id
        WHERE b.tourist_id = ?
        ORDER BY b.booking_date DESC
      `;
      const result = await pool.query(query, [touristId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  async findByProvider(providerId) {
    try {
      const query = `
        SELECT b.*, t.title, t.location, t.images, t.price,
               tourist.first_name, tourist.last_name, tourist.email, tourist.phone
        FROM bookings b
        JOIN tours t ON b.tour_id = t.tour_id
        JOIN users tourist ON b.tourist_id = tourist.user_id
        WHERE t.provider_id = ?
        ORDER BY b.booking_date DESC
      `;
      const result = await pool.query(query, [providerId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  async updateStatus(bookingId, status) {
    try {
      await pool.query("UPDATE bookings SET status = ? WHERE booking_id = ?", [
        status,
        bookingId,
      ]);
      const result = await pool.query(
        "SELECT * FROM bookings WHERE booking_id = ?",
        [bookingId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getAllBookings(filters = {}) {
    try {
      let query = `
        SELECT b.*, t.title as tour_title, 
               tourist.first_name as tourist_first_name, tourist.last_name as tourist_last_name,
               guide.first_name as guide_first_name, guide.last_name as guide_last_name
        FROM bookings b
        JOIN tours t ON b.tour_id = t.tour_id
        JOIN users tourist ON b.tourist_id = tourist.user_id
        JOIN users guide ON t.provider_id = guide.user_id
        WHERE 1=1
      `;

      const values = [];

      if (filters.status) {
        query += " AND b.status = ?";
        values.push(filters.status);
      }

      if (filters.date_from) {
        query += " AND b.tour_date >= ?";
        values.push(filters.date_from);
      }

      if (filters.date_to) {
        query += " AND b.tour_date <= ?";
        values.push(filters.date_to);
      }

      query += " ORDER BY b.booking_date DESC";

      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
};

export default Booking;
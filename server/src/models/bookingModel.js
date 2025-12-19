const pool = require("../config/database");

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

      const query = `
        INSERT INTO bookings (tourist_id, tour_id, tour_date, group_size, total_amount, special_requests)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      
      const values = [
        tourist_id,
        tour_id,
        tour_date,
        group_size,
        total_amount,
        special_requests,
      ];
      const result = await pool.query(query, values);
      return result.rows[0];
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
        WHERE b.booking_id = $1
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
        SELECT b.*, t.title, t.location, t.images, t.category,
               guide.first_name as guide_first_name, guide.last_name as guide_last_name, guide.badge_status
        FROM bookings b
        JOIN tours t ON b.tour_id = t.tour_id
        JOIN users guide ON t.provider_id = guide.user_id
        WHERE b.tourist_id = $1
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
        SELECT b.*, t.title, t.location, 
               tourist.first_name, tourist.last_name, tourist.email, tourist.phone
        FROM bookings b
        JOIN tours t ON b.tour_id = t.tour_id
        JOIN users tourist ON b.tourist_id = tourist.user_id
        WHERE t.provider_id = $1
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
      const query =
        "UPDATE bookings SET status = $1 WHERE booking_id = $2 RETURNING *";
      const result = await pool.query(query, [status, bookingId]);
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
      let paramCount = 0;

      if (filters.status) {
        paramCount++;
        query += ` AND b.status = $${paramCount}`;
        values.push(filters.status);
      }

      if (filters.date_from) {
        paramCount++;
        query += ` AND b.tour_date >= $${paramCount}`;
        values.push(filters.date_from);
      }

      if (filters.date_to) {
        paramCount++;
        query += ` AND b.tour_date <= $${paramCount}`;
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

module.exports = Booking;

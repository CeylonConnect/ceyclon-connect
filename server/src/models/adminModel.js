import pool from "../config/database.js";

const Admin = {
  async getPlatformStats() {
    try {
      const query = `
        SELECT 
          (SELECT COUNT(*) FROM users) as total_users,
          (SELECT COUNT(*) FROM users WHERE role = 'tourist') as total_tourists,
          (SELECT COUNT(*) FROM users WHERE role = 'local') as total_locals,
          (SELECT COUNT(*) FROM users WHERE role = 'admin') as total_admins,
          (SELECT COUNT(*) FROM tours) as total_tours,
          (SELECT COUNT(*) FROM bookings) as total_bookings,
          (SELECT COUNT(*) FROM reviews) as total_reviews,
          (SELECT COUNT(*) FROM badge_requests WHERE status = 'pending') as pending_badge_requests,
          (SELECT SUM(total_amount) FROM bookings WHERE status = 'completed') as total_revenue
      `;
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getBookingStats(timeframe = "month") {
    try {
      let unit = "MONTH";
      if (timeframe === "week") unit = "WEEK";
      if (timeframe === "year") unit = "YEAR";

      const query = `
        SELECT 
          DATE(booking_date) as date,
          COUNT(*) as booking_count,
          SUM(total_amount) as daily_revenue
        FROM bookings
        WHERE booking_date >= DATE_SUB(NOW(), INTERVAL 1 ${unit})
        GROUP BY DATE(booking_date)
        ORDER BY date
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  async getPopularTours(limit = 10) {
    try {
      const query = `
        SELECT 
          t.tour_id,
          t.title,
          t.location,
          t.category,
          COUNT(b.booking_id) as booking_count,
          AVG(r.rating) as avg_rating
        FROM tours t
        LEFT JOIN bookings b ON t.tour_id = b.tour_id
        LEFT JOIN reviews r ON t.tour_id = r.tour_id
        GROUP BY t.tour_id, t.title, t.location, t.category
        ORDER BY booking_count DESC
        LIMIT ?
      `;
      const safeLimit = Number.isFinite(Number(limit)) ? Number(limit) : 10;
      const result = await pool.query(query, [safeLimit]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
};

export default Admin;
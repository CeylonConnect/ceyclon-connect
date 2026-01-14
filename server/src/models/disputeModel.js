import pool from "../config/database.js";

export const Dispute = {
  async create(data) {
    const { booking_id, complainant_id, accused_id, type, description } = data;
    const insert = await pool.query(
      "INSERT INTO disputes (booking_id, complainant_id, accused_id, type, description) VALUES (?, ?, ?, ?, ?)",
      [booking_id, complainant_id, accused_id, type, description]
    );
    const result = await pool.query(
      "SELECT * FROM disputes WHERE dispute_id = ?",
      [insert.insertId]
    );
    return result.rows[0];
  },

  async findById(disputeId) {
    const query = `
      SELECT d.*, 
             c.first_name AS complainant_first_name, c.last_name AS complainant_last_name,
             a.first_name AS accused_first_name, a.last_name AS accused_last_name,
             b.tour_id,
             t.title AS tour_title
      FROM disputes d
      JOIN users c ON d.complainant_id = c.user_id
      JOIN users a ON d.accused_id = a.user_id
      JOIN bookings b ON d.booking_id = b.booking_id
      JOIN tours t ON b.tour_id = t.tour_id
      WHERE d.dispute_id = ?
    `;
    const result = await pool.query(query, [disputeId]);
    return result.rows[0];
  },

  async getAll(filters = {}) {
    let query = `
      SELECT d.*, 
             c.first_name AS complainant_first_name, c.last_name AS complainant_last_name,
             a.first_name AS accused_first_name, a.last_name AS accused_last_name,
             t.title AS tour_title
      FROM disputes d
      JOIN users c ON d.complainant_id = c.user_id
      JOIN users a ON d.accused_id = a.user_id
      JOIN bookings b ON d.booking_id = b.booking_id
      JOIN tours t ON b.tour_id = t.tour_id
      WHERE 1=1
    `;
    const values = [];

    if (filters.status) {
      query += ` AND d.status = ?`;
      values.push(filters.status);
    }

    query += " ORDER BY d.created_at DESC";
    const result = await pool.query(query, values);
    return result.rows;
  },

  async getMine(userId) {
    const query = `
      SELECT d.*,
             c.first_name AS complainant_first_name, c.last_name AS complainant_last_name,
             a.first_name AS accused_first_name, a.last_name AS accused_last_name,
             t.title AS tour_title
      FROM disputes d
      JOIN users c ON d.complainant_id = c.user_id
      JOIN users a ON d.accused_id = a.user_id
      JOIN bookings b ON d.booking_id = b.booking_id
      JOIN tours t ON b.tour_id = t.tour_id
      WHERE d.complainant_id = ? OR d.accused_id = ?
      ORDER BY d.created_at DESC
    `;
    const result = await pool.query(query, [userId, userId]);
    return result.rows;
  },

  async update(disputeId, data) {
    const { status, resolution } = data;
    const normalizedStatus = String(status || "")
      .toLowerCase()
      .trim();
    const resolvedAt =
      normalizedStatus === "resolved" || normalizedStatus === "closed"
        ? "NOW()"
        : "NULL";
    await pool.query(
      `
      UPDATE disputes
      SET status = ?, resolution = ?, resolved_at = ${resolvedAt}
      WHERE dispute_id = ?
    `,
      [normalizedStatus || status, resolution, disputeId]
    );
    const result = await pool.query(
      "SELECT * FROM disputes WHERE dispute_id = ?",
      [disputeId]
    );
    return result.rows[0];
  },

  async delete(disputeId) {
    const existing = await pool.query(
      "SELECT * FROM disputes WHERE dispute_id = ?",
      [disputeId]
    );
    const row = existing.rows[0];
    await pool.query("DELETE FROM disputes WHERE dispute_id = ?", [disputeId]);
    return row;
  },
};
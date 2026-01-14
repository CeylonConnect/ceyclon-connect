import pool from "../config/database.js";

function normalizeBadgeRow(row) {
  if (!row) return row;
  const out = { ...row };
  if (typeof out.document_urls === "string") {
    try {
      out.document_urls = JSON.parse(out.document_urls);
    } catch {
      // keep
    }
  }
  return out;
}

const BadgeRequest = {
  async create(requestData) {
    try {
      const { user_id, document_urls } = requestData;

      const insert = await pool.query(
        "INSERT INTO badge_requests (user_id, document_urls) VALUES (?, ?)",
        [user_id, JSON.stringify(document_urls ?? [])]
      );
      const created = await pool.query(
        "SELECT * FROM badge_requests WHERE request_id = ?",
        [insert.insertId]
      );
      return normalizeBadgeRow(created.rows[0]);
    } catch (error) {
      throw error;
    }
  },

  async findById(requestId) {
    try {
      const query = `
        SELECT br.*, u.first_name, u.last_name, u.email, u.phone
        FROM badge_requests br
        JOIN users u ON br.user_id = u.user_id
        WHERE br.request_id = ?
      `;
      const result = await pool.query(query, [requestId]);
      return normalizeBadgeRow(result.rows[0]);
    } catch (error) {
      throw error;
    }
  },

  async findByUserId(userId) {
    try {
      const query =
        "SELECT * FROM badge_requests WHERE user_id = ? ORDER BY submitted_at DESC";
      const result = await pool.query(query, [userId]);
      return result.rows.map(normalizeBadgeRow);
    } catch (error) {
      throw error;
    }
  },

  async getAllRequests(status = null) {
    try {
      let query = `
        SELECT br.*, u.first_name, u.last_name, u.email, u.phone
        FROM badge_requests br
        JOIN users u ON br.user_id = u.user_id
      `;

      let values = [];

      if (status) {
        query += " WHERE br.status = ?";
        values = [status];
      }

      query += " ORDER BY br.submitted_at DESC";

      const result = await pool.query(query, values);
      return result.rows.map(normalizeBadgeRow);
    } catch (error) {
      throw error;
    }
  },

  async updateStatus(requestId, status, reviewedBy, adminNotes = null) {
    try {
      await pool.query(
        `
        UPDATE badge_requests 
        SET status = ?, reviewed_at = NOW(), reviewed_by = ?, admin_notes = ?
        WHERE request_id = ?
      `,
        [status, reviewedBy, adminNotes, requestId]
      );
      const result = await pool.query(
        "SELECT * FROM badge_requests WHERE request_id = ?",
        [requestId]
      );
      return normalizeBadgeRow(result.rows[0]);
    } catch (error) {
      throw error;
    }
  },

  async getStats() {
    try {
      const query = `
        SELECT 
          status,
          COUNT(*) as count
        FROM badge_requests
        GROUP BY status
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
};

export default BadgeRequest;
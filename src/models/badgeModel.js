const pool = require('../config/database');

const BadgeRequest = {
  async create(requestData) {
    try {
      const { user_id, document_urls } = requestData;

      const query = `
        INSERT INTO badge_requests (user_id, document_urls)
        VALUES ($1, $2)
        RETURNING *
      `;

      const values = [user_id, document_urls];
      const result = await pool.query(query, values);
      return result.rows[0];
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
        WHERE br.request_id = $1
      `;
      const result = await pool.query(query, [requestId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async findByUserId(userId) {
    try {
      const query = 'SELECT * FROM badge_requests WHERE user_id = $1 ORDER BY submitted_at DESC';
      const result = await pool.query(query, [userId]);
      return result.rows;
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
        query += ' WHERE br.status = $1';
        values = [status];
      }
      
      query += ' ORDER BY br.submitted_at DESC';
      
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  async updateStatus(requestId, status, reviewedBy, adminNotes = null) {
    try {
      const query = `
        UPDATE badge_requests 
        SET status = $1, reviewed_at = CURRENT_TIMESTAMP, reviewed_by = $2, admin_notes = $3
        WHERE request_id = $4
        RETURNING *
      `;

      const values = [status, reviewedBy, adminNotes, requestId];
      const result = await pool.query(query, values);
      return result.rows[0];
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
  }
};

module.exports = BadgeRequest;
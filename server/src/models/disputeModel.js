import pool from "../config/database.js";

export const Dispute = {
  async create(data) {
    const { user_id, order_id, reason, status } = data;
    const query = `
      INSERT INTO disputes (user_id, order_id, reason, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    const values = [user_id, order_id, reason, status];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  
  async findById(disputeId) {
    const query = "SELECT * FROM disputes WHERE dispute_id = $1";
    const result = await pool.query(query, [disputeId]);
    return result.rows[0];
  },

  async getAll() {
    const query = "SELECT * FROM disputes ORDER BY created_at DESC";
    const result = await pool.query(query);
    return result.rows;
  },
  async update(disputeId, data) {
    const { reason, status } = data;
    const query = `
      UPDATE disputes
      SET reason = $1, status = $2, updated_at = CURRENT_TIMESTAMP
      WHERE dispute_id = $3
      RETURNING *
    `;
    const values = [reason, status, disputeId];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async delete(disputeId) {
    const query = "DELETE FROM disputes WHERE dispute_id = $1 RETURNING *";
    const result = await pool.query(query, [disputeId]);
    return result.rows[0];
  }
};

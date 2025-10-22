const pool = require("../config/database");
const bcrypt = require("bcryptjs");

const User = {
  async create(userData) {
    try {
      const {
        email,
        password,
        first_name,
        last_name,
        phone,
        role = "tourist",
      } = userData;
      const hashedPassword = await bcrypt.hash(password, 10);

      const query = `
        INSERT INTO users (email, password_hash, first_name, last_name, phone, role)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING user_id, email, first_name, last_name, role, created_at
      `;

      const values = [
        email,
        hashedPassword,
        first_name,
        last_name,
        phone,
        role,
      ];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async findByEmail(email) {
    try {
      const query = "SELECT * FROM users WHERE email = $1";
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async findById(userId) {
    try {
      const query =
        "SELECT user_id, email, first_name, last_name, phone, role, profile_picture, badge_status, is_verified, created_at FROM users WHERE user_id = $1";
      const result = await pool.query(query, [userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async update(userId, updateData) {
    try {
      const { first_name, last_name, phone, profile_picture } = updateData;

      const query = `
        UPDATE users 
        SET first_name = $1, last_name = $2, phone = $3, profile_picture = $4, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $5
        RETURNING user_id, email, first_name, last_name, phone, profile_picture
      `;

      const values = [first_name, last_name, phone, profile_picture, userId];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getAllUsers(role = null) {
    try {
      let query =
        "SELECT user_id, email, first_name, last_name, phone, role, badge_status, is_verified, created_at FROM users";
      let values = [];

      if (role) {
        query += " WHERE role = $1";
        values = [role];
      }

      query += " ORDER BY created_at DESC";
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  async updateBadgeStatus(userId, badgeStatus) {
    try {
      const query =
        "UPDATE users SET badge_status = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING *";
      const result = await pool.query(query, [badgeStatus, userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async suspendUser(userId) {
    try {
      const query =
        "UPDATE users SET is_verified = false, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 RETURNING *";
      const result = await pool.query(query, [userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
};

module.exports = User;

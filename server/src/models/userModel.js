import pool from "../config/database.js";
import bcrypt from "bcryptjs";

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
        profile_picture,
        profilePicture,
      } = userData;
      const hashedPassword = await bcrypt.hash(password, 10);

      const profilePictureUrl = profile_picture || profilePicture || null;

      const insert = await pool.query(
        "INSERT INTO users (email, password_hash, first_name, last_name, phone, role, profile_picture, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          email,
          hashedPassword,
          first_name,
          last_name,
          phone,
          role,
          profilePictureUrl,
          1,
        ]
      );
      const created = await pool.query(
        "SELECT user_id, email, first_name, last_name, role, profile_picture, is_verified, created_at FROM users WHERE user_id = ?",
        [insert.insertId]
      );
      return created.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async findByEmail(email) {
    try {
      const query = "SELECT * FROM users WHERE email = ?";
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async findById(userId) {
    try {
      const query =
        "SELECT user_id, email, first_name, last_name, phone, role, profile_picture, badge_status, is_verified, created_at, last_seen_at FROM users WHERE user_id = ?";
      const result = await pool.query(query, [userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async touchLastSeen(userId) {
    try {
      await pool.query(
        "UPDATE users SET last_seen_at = NOW() WHERE user_id = ?",
        [userId]
      );
      return true;
    } catch (error) {
      // Allow older schemas without last_seen_at
      return false;
    }
  },

  async getLastSeen(userId) {
    try {
      const result = await pool.query(
        "SELECT last_seen_at FROM users WHERE user_id = ?",
        [userId]
      );
      return result.rows[0]?.last_seen_at ?? null;
    } catch (error) {
      // Allow older schemas without last_seen_at
      return null;
    }
  },

  async update(userId, updateData) {
    try {
      const { first_name, last_name, phone, profile_picture } = updateData;

      await pool.query(
        "UPDATE users SET first_name = ?, last_name = ?, phone = ?, profile_picture = ?, updated_at = NOW() WHERE user_id = ?",
        [first_name, last_name, phone, profile_picture, userId]
      );
      const result = await pool.query(
        "SELECT user_id, email, first_name, last_name, phone, profile_picture FROM users WHERE user_id = ?",
        [userId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async updateEmail(userId, email) {
    try {
      await pool.query(
        "UPDATE users SET email = ?, updated_at = NOW() WHERE user_id = ?",
        [email, userId]
      );
      const result = await pool.query(
        "SELECT user_id, email, first_name, last_name, phone, role, profile_picture, badge_status, is_verified, created_at, last_seen_at FROM users WHERE user_id = ?",
        [userId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getAllUsers(role = null, q = null) {
    try {
      let query =
        "SELECT user_id, email, first_name, last_name, phone, role, profile_picture, badge_status, is_verified, created_at, last_seen_at FROM users";
      const values = [];
      const where = [];

      if (role) {
        where.push("role = ?");
        values.push(role);
      }

      const s = q != null ? String(q).trim() : "";
      if (s) {
        where.push(
          "(email LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR phone LIKE ?)"
        );
        const like = `%${s}%`;
        values.push(like, like, like, like);
      }

      if (where.length) query += " WHERE " + where.join(" AND ");
      query += " ORDER BY created_at DESC";

      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  async setIsVerified(userId, isVerified) {
    try {
      await pool.query(
        "UPDATE users SET is_verified = ?, updated_at = NOW() WHERE user_id = ?",
        [Boolean(isVerified) ? 1 : 0, userId]
      );
      const result = await pool.query(
        "SELECT user_id, email, first_name, last_name, phone, role, profile_picture, badge_status, is_verified, created_at, last_seen_at FROM users WHERE user_id = ?",
        [userId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async unblockAllUsers() {
    try {
      const result = await pool.query(
        "UPDATE users SET is_verified = 1, updated_at = NOW()"
      );
      return result.affectedRows ?? 0;
    } catch (error) {
      throw error;
    }
  },

  async updateBadgeStatus(userId, badgeStatus) {
    try {
      await pool.query(
        "UPDATE users SET badge_status = ?, updated_at = NOW() WHERE user_id = ?",
        [badgeStatus, userId]
      );
      const result = await pool.query("SELECT * FROM users WHERE user_id = ?", [
        userId,
      ]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async suspendUser(userId) {
    try {
      await pool.query(
        "UPDATE users SET is_verified = 0, updated_at = NOW() WHERE user_id = ?",
        [userId]
      );
      const result = await pool.query("SELECT * FROM users WHERE user_id = ?", [
        userId,
      ]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
};

export default User;
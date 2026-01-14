import pool from "../config/database.js";

const Message = {
  async create(messageData) {
    try {
      const { sender_id, receiver_id, booking_id, message_text } = messageData;

      // MySQL: INSERT + select by insertId
      const insert = await pool.query(
        "INSERT INTO messages (sender_id, receiver_id, booking_id, message_text, delivered_at) VALUES (?, ?, ?, ?, NOW())",
        [sender_id, receiver_id, booking_id, message_text]
      );
      const messageId = insert.insertId;
      const created = await pool.query(
        "SELECT * FROM messages WHERE message_id = ?",
        [messageId]
      );
      return created.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async findById(messageId) {
    try {
      const result = await pool.query(
        "SELECT * FROM messages WHERE message_id = ?",
        [messageId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getConversation(user1Id, user2Id, bookingId = null) {
    try {
      let query = `
        SELECT m.*, 
               sender.first_name as sender_first_name, sender.last_name as sender_last_name,
               receiver.first_name as receiver_first_name, receiver.last_name as receiver_last_name
        FROM messages m
        JOIN users sender ON m.sender_id = sender.user_id
        JOIN users receiver ON m.receiver_id = receiver.user_id
        WHERE ((m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?))
      `;

      const values = [user1Id, user2Id, user2Id, user1Id];

      if (bookingId) {
        query += " AND m.booking_id = ?";
        values.push(bookingId);
      }

      query += " ORDER BY m.created_at ASC";

      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  async getUserConversations(userId) {
    try {
      // MySQL equivalent of Postgres DISTINCT ON: get last message per other_user_id
      const query = `
        SELECT 
          x.other_user_id,
          u.first_name,
          u.last_name,
          u.profile_picture,
          u.role,
          m.message_text AS last_message,
          m.created_at AS last_message_time
        FROM (
          SELECT 
            CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END AS other_user_id,
            MAX(created_at) AS last_message_time
          FROM messages
          WHERE sender_id = ? OR receiver_id = ?
          GROUP BY other_user_id
        ) x
        JOIN messages m
          ON (
            (CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END) = x.other_user_id
            AND m.created_at = x.last_message_time
          )
        JOIN users u ON u.user_id = x.other_user_id
        ORDER BY x.last_message_time DESC
      `;

      const result = await pool.query(query, [userId, userId, userId, userId]);
      return result.rows;
    } catch (error) {
      console.error("Error in getUserConversations:", error);
      throw error;
    }
  },
  async markAsRead(messageId) {
    try {
      await pool.query(
        "UPDATE messages SET is_read = 1, read_at = COALESCE(read_at, NOW()) WHERE message_id = ?",
        [messageId]
      );
      const result = await pool.query(
        "SELECT * FROM messages WHERE message_id = ?",
        [messageId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async markConversationAsRead(receiverId, senderId) {
    try {
      const unread = await pool.query(
        "SELECT message_id FROM messages WHERE receiver_id = ? AND sender_id = ? AND is_read = 0",
        [receiverId, senderId]
      );

      const ids = unread.rows.map((r) => r.message_id);
      if (!ids.length) return [];

      await pool.query(
        "UPDATE messages SET is_read = 1, read_at = COALESCE(read_at, NOW()) WHERE message_id IN (?)",
        [ids]
      );

      const updated = await pool.query(
        "SELECT * FROM messages WHERE message_id IN (?)",
        [ids]
      );
      return updated.rows;
    } catch (error) {
      throw error;
    }
  },

  async getUnreadCount(userId) {
    try {
      const query =
        "SELECT COUNT(*) as unread_count FROM messages WHERE receiver_id = ? AND is_read = 0";
      const result = await pool.query(query, [userId]);
      return result.rows[0]?.unread_count ?? 0;
    } catch (error) {
      throw error;
    }
  },
};

export default Message;
const pool = require("../config/database");

const Message = {
  async create(messageData) {
    try {
      const { sender_id, receiver_id, booking_id, message_text } = messageData;

      const query = `
        INSERT INTO messages (sender_id, receiver_id, booking_id, message_text)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;

      const values = [sender_id, receiver_id, booking_id, message_text];
      const result = await pool.query(query, values);
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
        WHERE ((m.sender_id = $1 AND m.receiver_id = $2) OR (m.sender_id = $2 AND m.receiver_id = $1))
      `;

      const values = [user1Id, user2Id];
      let paramCount = 2;

      if (bookingId) {
        paramCount++;
        query += ` AND m.booking_id = $${paramCount}`;
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
      const query = `
        SELECT DISTINCT 
          CASE 
            WHEN m.sender_id = $1 THEN m.receiver_id 
            ELSE m.sender_id 
          END as other_user_id,
          u.first_name, u.last_name, u.profile_picture, u.role,
          MAX(m.created_at) as last_message_time,
          (SELECT message_text FROM messages 
           WHERE ((sender_id = $1 AND receiver_id = u.user_id) OR (sender_id = u.user_id AND receiver_id = $1))
           ORDER BY created_at DESC LIMIT 1) as last_message
        FROM messages m
        JOIN users u ON (u.user_id = CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END)
        WHERE m.sender_id = $1 OR m.receiver_id = $1
        GROUP BY other_user_id, u.first_name, u.last_name, u.profile_picture, u.role
        ORDER BY last_message_time DESC
      `;

      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  async markAsRead(messageId) {
    try {
      const query =
        "UPDATE messages SET is_read = true WHERE message_id = $1 RETURNING *";
      const result = await pool.query(query, [messageId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getUnreadCount(userId) {
    try {
      const query =
        "SELECT COUNT(*) as unread_count FROM messages WHERE receiver_id = $1 AND is_read = false";
      const result = await pool.query(query, [userId]);
      return result.rows[0].unread_count;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Message;

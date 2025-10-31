import pool from "../config/database.js";

export const Event = {
  async create(data) {
    const { title, description, location, event_date, event_time, image_url } = data;
    const query = `
      INSERT INTO events (title, description, location, event_date, event_time, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [title, description, location, event_date, event_time, image_url];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findById(eventId) {
    const query = "SELECT * FROM events WHERE event_id = $1";
    const result = await pool.query(query, [eventId]);
    return result.rows[0];
  }
}
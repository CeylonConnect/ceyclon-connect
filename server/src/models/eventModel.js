import pool from "../config/database.js";

export const Event = {
  async create(data) {
    const { title, description, location, event_date, event_time, image_url } =
      data;
    const insert = await pool.query(
      "INSERT INTO events (title, description, location, event_date, event_time, image_url) VALUES (?, ?, ?, ?, ?, ?)",
      [title, description, location, event_date, event_time, image_url]
    );
    const result = await pool.query("SELECT * FROM events WHERE event_id = ?", [
      insert.insertId,
    ]);
    return result.rows[0];
  },

  async findById(eventId) {
    const query = "SELECT * FROM events WHERE event_id = ?";
    const result = await pool.query(query, [eventId]);
    return result.rows[0];
  },

  async getAll() {
    const query = "SELECT * FROM events ORDER BY event_date ASC";
    const result = await pool.query(query);
    return result.rows;
  },

  async update(eventId, data) {
    const { title, description, location, event_date, event_time, image_url } =
      data;
    await pool.query(
      `
      UPDATE events
      SET title=?, description=?, location=?, event_date=?, event_time=?, image_url=?, updated_at=NOW()
      WHERE event_id=?
    `,
      [title, description, location, event_date, event_time, image_url, eventId]
    );
    const result = await pool.query("SELECT * FROM events WHERE event_id = ?", [
      eventId,
    ]);
    return result.rows[0];
  },

  async delete(eventId) {
    const existing = await pool.query(
      "SELECT * FROM events WHERE event_id = ?",
      [eventId]
    );
    const row = existing.rows[0];
    await pool.query("DELETE FROM events WHERE event_id = ?", [eventId]);
    return row;
  },
};
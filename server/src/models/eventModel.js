import pool from "../config/database.js";
export const Event = {
  async create(data) {
    const { title, description, location, event_date, event_time, image_url } =
      data;
    const query = `
      INSERT INTO events (title, description, location, event_date, event_time, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [
      title,
      description,
      location,
      event_date,
      event_time,
      image_url,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findById(eventId) {
    const query = "SELECT * FROM events WHERE event_id = $1";
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
    const query = `
      UPDATE events
      SET title=$1, description=$2, location=$3, event_date=$4, event_time=$5, image_url=$6, updated_at=CURRENT_TIMESTAMP
      WHERE event_id=$7
      RETURNING *
    `;
    const values = [
      title,
      description,
      location,
      event_date,
      event_time,
      image_url,
      eventId,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async delete(eventId) {
    const query = "DELETE FROM events WHERE event_id = $1 RETURNING *";
    const result = await pool.query(query, [eventId]);
    return result.rows[0];
  },
};

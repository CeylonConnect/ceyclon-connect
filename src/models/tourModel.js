const pool = require("../config/database");

const Tour = {
  async create(tourData) {
    try {
      const {
        provider_id,
        title,
        description,
        price,
        duration_hours,
        location,
        district,
        category,
        max_group_size,
        images = [],
        itinerary,
        sustainability_info,
        safety_badge_required = false,
      } = tourData;

      const query = `
        INSERT INTO tours (
          provider_id, title, description, price, duration_hours, 
          location, district, category, max_group_size, images,
          itinerary, sustainability_info, safety_badge_required
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *
      `;

      const values = [
        provider_id,
        title,
        description,
        price,
        duration_hours,
        location,
        district,
        category,
        max_group_size,
        images,
        itinerary,
        sustainability_info,
        safety_badge_required,
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async findAll(filters = {}) {
    try {
      let query = `
        SELECT t.*, u.first_name, u.last_name, u.badge_status, u.profile_picture as guide_image
        FROM tours t
        JOIN users u ON t.provider_id = u.user_id
        WHERE t.availability = true
      `;

      const values = [];
      let paramCount = 0;

      // Advanced filtering based on proposal requirements
      if (filters.location) {
        paramCount++;
        query += ` AND (LOWER(t.location) LIKE LOWER($${paramCount}) OR LOWER(t.district) LIKE LOWER($${paramCount}))`;
        values.push(`%${filters.location}%`);
      }

      if (filters.category) {
        paramCount++;
        query += ` AND t.category = $${paramCount}`;
        values.push(filters.category);
      }

      if (filters.maxPrice) {
        paramCount++;
        query += ` AND t.price <= $${paramCount}`;
        values.push(filters.maxPrice);
      }

      if (filters.minPrice) {
        paramCount++;
        query += ` AND t.price >= $${paramCount}`;
        values.push(filters.minPrice);
      }

      if (filters.duration) {
        paramCount++;
        query += ` AND t.duration_hours <= $${paramCount}`;
        values.push(filters.duration);
      }

      if (filters.safety_badge === "true") {
        query += ` AND u.badge_status = 'verified'`;
      }

      if (filters.provider_id) {
        paramCount++;
        query += ` AND t.provider_id = $${paramCount}`;
        values.push(filters.provider_id);
      }

      query += " ORDER BY t.created_at DESC";

      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  async findById(tourId) {
    try {
      const query = `
        SELECT t.*, u.first_name, u.last_name, u.profile_picture, u.badge_status, u.phone as guide_phone
        FROM tours t
        JOIN users u ON t.provider_id = u.user_id
        WHERE t.tour_id = $1
      `;

      const result = await pool.query(query, [tourId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async update(tourId, updateData) {
    try {
      const {
        title,
        description,
        price,
        duration_hours,
        location,
        district,
        category,
        max_group_size,
        availability,
        images,
        itinerary,
        sustainability_info,
      } = updateData;

      const query = `
        UPDATE tours 
        SET title = $1, description = $2, price = $3, duration_hours = $4, 
            location = $5, district = $6, category = $7, max_group_size = $8, 
            availability = $9, images = $10, itinerary = $11, sustainability_info = $12,
            updated_at = CURRENT_TIMESTAMP
        WHERE tour_id = $13
        RETURNING *
      `;

      const values = [
        title,
        description,
        price,
        duration_hours,
        location,
        district,
        category,
        max_group_size,
        availability,
        images,
        itinerary,
        sustainability_info,
        tourId,
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async delete(tourId) {
    try {
      const query = "DELETE FROM tours WHERE tour_id = $1 RETURNING *";
      const result = await pool.query(query, [tourId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getToursByDistrict() {
    try {
      const query = `
        SELECT district, COUNT(*) as tour_count
        FROM tours 
        WHERE availability = true
        GROUP BY district
        ORDER BY tour_count DESC
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Tour;

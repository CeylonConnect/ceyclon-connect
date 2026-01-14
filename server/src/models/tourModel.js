import pool from "../config/database.js";

const toDbNull = (value) => (value === undefined ? null : value);

function normalizeTourRow(row) {
  if (!row) return row;
  const out = { ...row };
  for (const key of ["images", "itinerary"]) {
    const v = out[key];
    if (typeof v === "string") {
      try {
        out[key] = JSON.parse(v);
      } catch {
        // keep as-is
      }
    }
  }
  return out;
}

const Tour = {
  // ✅ Create new tour
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

      const imagesJson = JSON.stringify(images ?? []);
      const itineraryJson =
        itinerary == null ? null : JSON.stringify(itinerary);

      const insert = await pool.query(
        `
        INSERT INTO tours (
          provider_id, title, description, price, duration_hours,
          location, district, category, max_group_size, images,
          itinerary, sustainability_info, safety_badge_required
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          toDbNull(provider_id),
          toDbNull(title),
          toDbNull(description),
          toDbNull(price),
          toDbNull(duration_hours),
          toDbNull(location),
          toDbNull(district),
          toDbNull(category),
          toDbNull(max_group_size),
          imagesJson,
          itineraryJson,
          toDbNull(sustainability_info),
          safety_badge_required ? 1 : 0,
        ]
      );

      const created = await pool.query(
        "SELECT * FROM tours WHERE tour_id = ?",
        [insert.insertId]
      );
      return normalizeTourRow(created.rows[0]);
    } catch (error) {
      console.error("Error creating tour:", error);
      throw error;
    }
  },

  // ✅ Get all tours (with optional filters)
  async findAll(filters = {}) {
    try {
      let query = `
        SELECT t.*, 
               u.first_name, u.last_name, u.badge_status, 
               u.profile_picture AS guide_image,
               COALESCE(rv.rating_value, 0) AS rating_value,
               COALESCE(rv.rating_count, 0) AS rating_count
        FROM tours t
        JOIN users u ON t.provider_id = u.user_id
        LEFT JOIN (
          SELECT tour_id, AVG(rating) AS rating_value, COUNT(*) AS rating_count
          FROM reviews
          GROUP BY tour_id
        ) rv ON rv.tour_id = t.tour_id
        WHERE t.availability = true
      `;

      const values = [];

      // --- Filtering Options ---
      if (filters.location) {
        query +=
          " AND (LOWER(t.location) LIKE LOWER(?) OR LOWER(t.district) LIKE LOWER(?))";
        const like = `%${filters.location}%`;
        values.push(like, like);
      }

      if (filters.category) {
        query += " AND t.category = ?";
        values.push(filters.category);
      }

      if (filters.maxPrice) {
        query += " AND t.price <= ?";
        values.push(filters.maxPrice);
      }

      if (filters.minPrice) {
        query += " AND t.price >= ?";
        values.push(filters.minPrice);
      }

      if (filters.duration) {
        query += " AND t.duration_hours <= ?";
        values.push(filters.duration);
      }

      if (filters.safety_badge === "true") {
        query += ` AND u.badge_status = 'verified'`;
      }

      if (filters.provider_id) {
        query += " AND t.provider_id = ?";
        values.push(filters.provider_id);
      }

      query += " ORDER BY t.created_at DESC";

      const result = await pool.query(query, values);
      return result.rows.map(normalizeTourRow);
    } catch (error) {
      console.error("Error fetching tours:", error);
      throw error;
    }
  },

  // ✅ Get tour by ID
  async findById(tourId) {
    try {
      const query = `
      SELECT 
        t.*,
        u.first_name, 
        u.last_name, 
        u.profile_picture, 
        u.badge_status, 
        u.phone AS guide_phone,
        COALESCE(rv.rating_value, 0) AS rating_value,
        COALESCE(rv.rating_count, 0) AS rating_count
      FROM tours t
      JOIN users u ON t.provider_id = u.user_id
      LEFT JOIN (
        SELECT tour_id, AVG(rating) AS rating_value, COUNT(*) AS rating_count
        FROM reviews
        GROUP BY tour_id
      ) rv ON rv.tour_id = t.tour_id
      WHERE t.tour_id = ?
      LIMIT 1
    `;

      const result = await pool.query(query, [parseInt(tourId)]);

      // If no result found
      if (result.rows.length === 0) {
        return null;
      }

      return normalizeTourRow(result.rows[0]);
    } catch (error) {
      console.error("Error fetching tour by ID:", error);
      throw error;
    }
  },

  // ✅ Update tour
  async update(tourId, updateData) {
    try {
      // Build dynamic query
      const setClauses = [];
      const values = [];

      const allowed = new Set([
        "title",
        "description",
        "price",
        "duration_hours",
        "location",
        "district",
        "category",
        "max_group_size",
        "images",
        "itinerary",
        "sustainability_info",
        "availability",
        "safety_badge_required",
      ]);

      for (const [key, value] of Object.entries(updateData)) {
        // Skip undefined or null
        if (value === undefined) continue;
        if (!allowed.has(key)) continue;

        if (key === "images") {
          setClauses.push(`${key} = ?`);
          values.push(JSON.stringify(value ?? []));
          continue;
        }
        if (key === "itinerary") {
          setClauses.push(`${key} = ?`);
          values.push(value == null ? null : JSON.stringify(value));
          continue;
        }
        if (key === "availability" || key === "safety_badge_required") {
          setClauses.push(`${key} = ?`);
          values.push(value ? 1 : 0);
          continue;
        }

        setClauses.push(`${key} = ?`);
        values.push(value);
      }

      // Always update the updated_at timestamp
      setClauses.push(`updated_at = NOW()`);

      if (setClauses.length === 1) {
        throw new Error("No valid fields to update");
      }

      const query = `
      UPDATE tours
      SET ${setClauses.join(", ")}
      WHERE tour_id = ?
    `;

      values.push(tourId);
      await pool.query(query, values);
      const result = await pool.query("SELECT * FROM tours WHERE tour_id = ?", [
        tourId,
      ]);
      return normalizeTourRow(result.rows[0]);
    } catch (error) {
      console.error("Error updating tour:", error);
      throw error;
    }
  },

  // ✅ Delete tour
  async delete(tourId) {
    try {
      const existing = await pool.query(
        "SELECT * FROM tours WHERE tour_id = ?",
        [tourId]
      );
      const row = existing.rows[0];
      await pool.query("DELETE FROM tours WHERE tour_id = ?", [tourId]);
      return normalizeTourRow(row);
    } catch (error) {
      console.error("Error deleting tour:", error);
      throw error;
    }
  },

  //get tour by provider
  async getByProvider(providerId) {
    try {
      const query = `
      SELECT 
        t.*, 
        u.first_name, 
        u.last_name, 
        u.profile_picture AS guide_image
      FROM tours t
      JOIN users u ON t.provider_id = u.user_id
      WHERE t.provider_id = ?
      ORDER BY t.created_at DESC;
    `;
      const result = await pool.query(query, [providerId]);
      return result.rows.map(normalizeTourRow);
    } catch (error) {
      console.error("Error fetching tours by provider:", error);
      throw error;
    }
  },

  // ✅ Get tour count by district
  async getToursByDistrict() {
    try {
      const query = `
        SELECT district, COUNT(*) AS tour_count
        FROM tours 
        WHERE availability = true
        GROUP BY district
        ORDER BY tour_count DESC
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error grouping tours by district:", error);
      throw error;
    }
  },
};

export default Tour;
const pool = require("../config/database");

const Review = {
  async create(reviewData) {
    try {
      const { booking_id, tourist_id, tour_id, rating, comment } = reviewData;

      const existingReview = await pool.query(
        "SELECT * FROM reviews WHERE booking_id = $1",
        [booking_id]
      );

      if (existingReview.rows.length > 0) {
        throw new Error("Review already exists for this booking");
      }

      const query = `
        INSERT INTO reviews (booking_id, tourist_id, tour_id, rating, comment)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;

      const values = [booking_id, tourist_id, tour_id, rating, comment];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async findByTourId(tourId) {
    try {
      const query = `
        SELECT r.*, u.first_name, u.last_name, u.profile_picture
        FROM reviews r
        JOIN users u ON r.tourist_id = u.user_id
        WHERE r.tour_id = $1
        ORDER BY r.created_at DESC
      `;
      const result = await pool.query(query, [tourId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  async findByGuideId(guideId) {
    try {
      const query = `
        SELECT r.*, u.first_name, u.last_name, t.title as tour_title
        FROM reviews r
        JOIN tours t ON r.tour_id = t.tour_id
        JOIN users u ON r.tourist_id = u.user_id
        WHERE t.provider_id = $1
        ORDER BY r.created_at DESC
      `;
      const result = await pool.query(query, [guideId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  async getAverageRating(tourId) {
    try {
      const query = `
        SELECT 
          AVG(rating) as average_rating,
          COUNT(*) as total_reviews,
          COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
          COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
          COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
          COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
          COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
        FROM reviews 
        WHERE tour_id = $1
      `;
      const result = await pool.query(query, [tourId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getGuideAverageRating(guideId) {
    try {
      const query = `
        SELECT 
          AVG(r.rating) as average_rating,
          COUNT(*) as total_reviews
        FROM reviews r
        JOIN tours t ON r.tour_id = t.tour_id
        WHERE t.provider_id = $1
      `;
      const result = await pool.query(query, [guideId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getReviewStats() {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_reviews,
          AVG(rating) as platform_avg_rating,
          COUNT(DISTINCT tour_id) as tours_reviewed,
          COUNT(DISTINCT tourist_id) as unique_reviewers
        FROM reviews
      `;
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Review;

import pool from "../config/database.js";

const Review = {
  async findLatestBookingIdForTouristAndTour(touristId, tourId) {
    const result = await pool.query(
      `
        SELECT booking_id
        FROM bookings
        WHERE tourist_id = ? AND tour_id = ?
        ORDER BY booking_date DESC
        LIMIT 1
      `,
      [touristId, tourId]
    );
    return result.rows[0]?.booking_id ?? null;
  },

  async create(reviewData) {
    const {
      booking_id: rawBookingId,
      tourist_id: touristId,
      tour_id: tourId,
      rating,
      comment,
    } = reviewData;

    if (!touristId) throw new Error("tourist_id is required");
    if (!tourId) throw new Error("tour_id is required");
    const safeRating = Number(rating);
    if (!Number.isFinite(safeRating) || safeRating < 1 || safeRating > 5) {
      throw new Error("rating must be between 1 and 5");
    }

    // If booking_id is not provided, attach to the latest booking for this tour.
    const bookingId =
      rawBookingId ??
      (await Review.findLatestBookingIdForTouristAndTour(touristId, tourId));

    if (!bookingId) {
      throw new Error(
        "You must have a booking for this tour to leave a review"
      );
    }

    // Verify booking belongs to this tourist + tour
    const booking = await pool.query(
      "SELECT booking_id FROM bookings WHERE booking_id = ? AND tourist_id = ? AND tour_id = ? LIMIT 1",
      [bookingId, touristId, tourId]
    );
    if (!booking.rows.length) {
      throw new Error("Invalid booking for this review");
    }

    // Only one review per booking
    const existingReview = await pool.query(
      "SELECT review_id FROM reviews WHERE booking_id = ? LIMIT 1",
      [bookingId]
    );
    if (existingReview.rows.length > 0) {
      throw new Error("Review already exists for this booking");
    }

    const insert = await pool.query(
      "INSERT INTO reviews (booking_id, tourist_id, tour_id, rating, comment) VALUES (?, ?, ?, ?, ?)",
      [bookingId, touristId, tourId, safeRating, comment ?? null]
    );

    const created = await pool.query(
      `
        SELECT r.*, u.first_name, u.last_name, u.profile_picture
        FROM reviews r
        JOIN users u ON r.tourist_id = u.user_id
        WHERE r.review_id = ?
      `,
      [insert.insertId]
    );
    return created.rows[0];
  },

  async findByTourId(tourId) {
    try {
      const query = `
        SELECT r.*, u.first_name, u.last_name, u.profile_picture
        FROM reviews r
        JOIN users u ON r.tourist_id = u.user_id
        WHERE r.tour_id = ?
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
        WHERE t.provider_id = ?
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
        WHERE tour_id = ?
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
        WHERE t.provider_id = ?
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

export default Review;
import api from './services/api';

export const createHotelReview = (hotelId, data) =>
  api.post(`/hotels/${hotelId}/reviews`, data);

export const getHotelReviews = (hotelId, { page = 1, limit = 10, sort = "desc" } = {}) =>
  api.get(`/hotels/${hotelId}/reviews`, { params: { page, limit, sort } });

export const getHotelReview = (hotelId, reviewId) =>
  api.get(`/hotels/${hotelId}/reviews/${reviewId}`);

export const updateHotelReview = (hotelId, reviewId, data) =>
  api.put(`/hotels/${hotelId}/reviews/${reviewId}`, data);

export const deleteHotelReview = (hotelId, reviewId) =>
  api.delete(`/hotels/${hotelId}/reviews/${reviewId}`);

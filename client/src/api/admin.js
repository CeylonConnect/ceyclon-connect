import { api } from "./client";

// Stats
export const getPlatformStats = () => api.get("/admin/platform-stats");
export const getBookingStats = (timeframe) =>
  api.get(`/admin/booking-stats${timeframe ? `?timeframe=${encodeURIComponent(timeframe)}` : ""}`);
export const getPopularTours = (limit = 10) =>
  api.get(`/admin/popular-tours?limit=${encodeURIComponent(limit)}`);
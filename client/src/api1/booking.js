import { api, normalizeList } from "./client";

// Adjust path names if your backend differs
export const getBookingsByProvider = async (providerId) => {
  const res = await api.get(`/bookings/provider/${encodeURIComponent(providerId)}`);
  return normalizeList(res);
};

export const getBookingsByTourist = async (touristId) => {
  const res = await api.get(`/bookings/tourist/${encodeURIComponent(touristId)}`);
  return normalizeList(res);
};

export const updateBookingStatus = (id, status) =>
  api.patch(`/bookings/${id}/status`, { status });
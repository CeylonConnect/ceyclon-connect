import { api, normalizeList } from "./client";

export const createTour = (data) => api.post("/tours", data);

export const getToursByProvider = async (providerId) => {
  const res = await api.get(`/tours/provider/${encodeURIComponent(providerId)}`);
  return normalizeList(res);
};

export const updateTour = (id, data) => api.put(`/tours/${id}`, data);

export const deleteTour = (id) => api.del(`/tours/${id}`);
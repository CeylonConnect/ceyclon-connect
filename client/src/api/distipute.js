import { api } from "./client";

// Normalize common backend shapes to an array
// Supports: [ ... ], { data: [...] }, { items: [...] }, { results: [...] }, { disputes: [...] }
function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.disputes)) return payload.disputes;
  // If your backend uses a different shape (e.g., { data: { rows: [...] } }), add it here:
  if (Array.isArray(payload?.data?.rows)) return payload.data.rows;
  return [];
}

export const createDispute = (data) => api.post("/disputes", data);

export const getAllDisputes = async (query = "") => {
  const res = await api.get(`/disputes${query ? `?${query}` : ""}`);
  return normalizeList(res);
};

export const getDisputeById = (id) => api.get(`/disputes/${id}`);

export const updateDispute = (id, data) => api.put(`/disputes/${id}`, data);

export const deleteDispute = (id) => api.del(`/disputes/${id}`);
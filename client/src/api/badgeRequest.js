import { api } from "./client";

// Normalize any of these shapes to an array:
// - [ ... ]
// - { data: [ ... ] }
// - { items: [ ... ] }
// - { results: [ ... ] }
// - { requests: [ ... ] }
function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.requests)) return payload.requests;
  // Some APIs return a paged object with count; fallback to empty list
  return [];
}

export const getAllBadgeRequests = async (status) => {
  const res = await api.get(
    `/badge-requests${status ? `?status=${encodeURIComponent(status)}` : ""}`
  );
  return normalizeList(res);
};

export const getBadgeRequestById = (id) => api.get(`/badge-requests/${id}`);

export const updateBadgeRequestStatus = (id, { status, reviewedBy, adminNotes }) =>
  api.patch(`/badge-requests/${id}/status`, { status, reviewedBy, adminNotes });

export const getBadgeRequestStats = () => api.get("/badge-requests/stats");
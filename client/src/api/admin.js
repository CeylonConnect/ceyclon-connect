import { api } from "./client";

// Stats
export const getPlatformStats = async () => {
  const s = await api.get("/admin/stats/platform");
  const tourists = Number(s?.total_tourists ?? 0);
  const locals = Number(s?.total_locals ?? 0);
  const admins = Number(s?.total_admins ?? 0);
  const totalUsers = Number(s?.total_users ?? tourists + locals + admins);

  return {
    totalUsers,
    tourists,
    locals,
    admins,
    totalTours: Number(s?.total_tours ?? 0),
    totalBookings: Number(s?.total_bookings ?? 0),
    totalReviews: Number(s?.total_reviews ?? 0),
    pendingBadgeRequests: Number(s?.pending_badge_requests ?? 0),
    revenue: Number(s?.total_revenue ?? 0),
  };
};

export const getBookingStats = (timeframe) =>
  api.get(
    `/admin/stats/bookings${
      timeframe ? `?timeframe=${encodeURIComponent(timeframe)}` : ""
    }`
  );

export const getPopularTours = (limit = 10) =>
  api.get(`/admin/stats/popular-tours?limit=${encodeURIComponent(limit)}`);

// Users
export const getAdminUsers = ({ role, q } = {}) => {
  const params = new URLSearchParams();
  if (role && role !== "all") params.set("role", role);
  if (q && String(q).trim()) params.set("q", String(q).trim());
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return api.get(`/admin/users${suffix}`);
};

export const setAdminUserBlocked = (userId, blocked) =>
  api.patch(`/admin/users/${encodeURIComponent(userId)}/block`, { blocked });

export const unblockAllUsers = () => api.patch("/admin/users/unblock-all");

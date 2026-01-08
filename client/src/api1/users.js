import { api } from "./client";

export const getUserLastSeen = (userId) =>
  api.get(`/users/${encodeURIComponent(userId)}/last-seen`);

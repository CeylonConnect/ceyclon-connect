import { api } from "./client";

export const createBadgeRequest = (payload) =>
  api.post("/badge-requests", payload);

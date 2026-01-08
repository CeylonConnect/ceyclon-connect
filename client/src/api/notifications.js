
import { api } from "./client";

export const getNotifications = async ({
  limit = 10,
  offset = 0,
  unreadOnly = false,
} = {}) =>
  api.get(
    `/notifications?limit=${encodeURIComponent(
      limit
    )}&offset=${encodeURIComponent(offset)}&unreadOnly=${unreadOnly ? 1 : 0}`
  );

export const getUnreadNotificationCount = async () =>
  api.get("/notifications/unread-count");

export const markAllNotificationsRead = async () =>
  api.patch("/notifications/read-all", {});

export const markNotificationRead = async (id) =>
  api.patch(`/notifications/${id}/read`, {});

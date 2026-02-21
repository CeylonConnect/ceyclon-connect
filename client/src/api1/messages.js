import { api, normalizeList } from "./client";

export const sendMessage = (data) => api.post("/messages", data);

export const getUserConversations = async (userId) => {
  const res = await api.get(`/messages/user/${encodeURIComponent(userId)}`);
  return normalizeList(res);
};

export const getConversation = async (user1Id, user2Id, { bookingId } = {}) => {
  const qs = bookingId ? `?bookingId=${encodeURIComponent(bookingId)}` : "";
  const res = await api.get(
    `/messages/conversation/${encodeURIComponent(user1Id)}/${encodeURIComponent(
      user2Id
    )}${qs}`
  );
  return normalizeList(res);
};

export const markMessageAsRead = (messageId) =>
  api.patch(`/messages/${encodeURIComponent(messageId)}/read`, {});

export const markConversationAsRead = (otherUserId) =>
  api.patch(
    `/messages/conversation/${encodeURIComponent(otherUserId)}/read`,
    {}
  );

export const getUnreadCount = (userId) =>
  api.get(`/messages/user/${encodeURIComponent(userId)}/unread-count`);

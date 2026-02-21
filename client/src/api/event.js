import { api } from "./client";

const toClientEvent = (row) => {
  if (!row || typeof row !== "object") return row;
  const id = row.id ?? row.event_id ?? row.eventId;
  const startDate = row.startDate ?? row.event_date ?? row.eventDate;
  const time = row.time ?? row.event_time ?? row.eventTime;
  const image = row.image ?? row.image_url ?? row.imageUrl;

  return {
    ...row,
    id,
    title: row.title ?? "",
    description: row.description ?? "",
    location: row.location ?? "",
    startDate,
    time: time ? String(time).slice(0, 5) : "",
    image,
    // optional fields used by UI
    type: row.type ?? "",
    endDate: row.endDate ?? row.end_date ?? "",
  };
};

const toServerEventPayload = (data) => {
  const d = data || {};
  return {
    title: d.title,
    description: d.description,
    location: d.location,
    event_date: d.startDate || d.event_date || d.eventDate,
    event_time: d.time || d.event_time || d.eventTime,
    image_url: d.image || d.image_url || d.imageUrl,
  };
};

export const createEvent = async (data) =>
  toClientEvent(await api.post("/events", toServerEventPayload(data)));

export const getAllEvents = async () => {
  const list = await api.get("/events");
  return Array.isArray(list) ? list.map(toClientEvent) : [];
};

export const getEventById = async (id) =>
  toClientEvent(await api.get(`/events/${id}`));

export const updateEvent = async (id, data) =>
  api.put(`/events/${id}`, toServerEventPayload(data));

export const deleteEvent = (id) => api.del(`/events/${id}`);

export const isUpcomingEvent = (ev, now = new Date()) => {
  const s = ev?.startDate;
  if (!s) return true;
  const dt = new Date(s);
  if (Number.isNaN(dt.getTime())) return true;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return dt >= today;
};

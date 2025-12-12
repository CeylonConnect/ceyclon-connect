import { api } from "./client";

export const createEvent = (data) => api.post("/events", data);
export const getAllEvents = () => api.get("/events");
export const getEventById = (id) => api.get(`/events/${id}`);
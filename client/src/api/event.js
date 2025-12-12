import { api } from "./client";

export const createEvent = (data) => api.post("/events", data);
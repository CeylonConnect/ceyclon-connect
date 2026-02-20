import { api } from "./client";

export async function generateDescription(payload) {
  // payload example:
  // { kind: 'tour'|'event', title, description?, location, category/type, ... }
  return api.post("/ai/description", payload);
}

export async function chatAssistant(payload) {
  // payload example:
  // { messages: [{ role: 'user'|'assistant', content: string }, ...] }
  // or { message: string }
  return api.post("/ai/chat", payload);
}

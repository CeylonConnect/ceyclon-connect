import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useBooking } from "../../state/BookingContext";
import { useAuth } from "../../state/AuthContext";

export default function ChatPanel({ initialGuideId }) {
  const { bookings, messages, sendMessage } = useBooking();
  const { user } = useAuth();

  const guides = useMemo(() => {
    const map = new Map();
    bookings.forEach((b) => {
      map.set(b.guide.id, b.guide);
    });
    return Array.from(map.values());
  }, [bookings]);

  const [activeGuideId, setActiveGuideId] = useState(
    initialGuideId || guides[0]?.id || null
  );
  const [text, setText] = useState("");

  const thread = messages[activeGuideId] ?? [];

  const onSend = () => {
    if (!text.trim() || !activeGuideId) return;
    sendMessage({ guideId: activeGuideId, sender: "user", text: text.trim() });
    setText("");
  };

  return (
    <div className="grid gap-4 md:grid-cols-[260px_1fr]">
      {/* Conversations list */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-3">
        <h4 className="mb-2 text-sm font-semibold text-neutral-700">Guides</h4>
        <div className="space-y-2">
          {guides.length === 0 && (
            <div className="text-sm text-neutral-500">No conversations yet.</div>
          )}
          {guides.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGuideId(g.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-neutral-50 ${
                activeGuideId === g.id ? "bg-neutral-50" : ""
              }`}
            >
              <img src={g.avatar} className="h-8 w-8 rounded-full object-cover" alt={g.name} />
              <div className="flex-1">
                <div className="text-sm font-medium text-neutral-800">{g.name}</div>
                <div className="text-xs text-neutral-500">
                  {messages[g.id]?.slice(-1)[0]?.text?.slice(0, 36) || "No messages yet"}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Message thread */}
      <div className="flex min-h-[24rem] flex-col rounded-2xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 p-3">
          <div className="text-sm text-neutral-600">
            {activeGuideId
              ? `Chat with ${guides.find((g) => g.id === activeGuideId)?.name ?? "Guide"}`
              : "Select a conversation"}
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {thread.length === 0 ? (
            <div className="text-sm text-neutral-500">Say hello to start the conversation.</div>
          ) : (
            thread.map((m) => (
              <div
                key={m.id}
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  m.sender === "user"
                    ? "ml-auto bg-orange-500 text-white"
                    : "bg-neutral-100 text-neutral-800"
                }`}
                title={new Date(m.createdAt).toLocaleString()}
              >
                {m.text}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center gap-2 border-t border-neutral-200 p-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSend()}
            placeholder={activeGuideId ? "Write a message..." : "Select a guide first"}
            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400/40"
          />
          <button
            onClick={onSend}
            disabled={!activeGuideId || !text.trim()}
            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

ChatPanel.propTypes = {
  initialGuideId: PropTypes.number,
};
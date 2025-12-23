import React, { useEffect, useMemo, useRef, useState } from "react";
import { chatAssistant } from "../api/ai";

export default function AIAssistant({ open, onClose, variant = "fixed" }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! Ask me for Sri Lanka tour ideas, districts to visit, or event suggestions.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  const canSend = useMemo(
    () => !sending && String(input || "").trim().length > 0,
    [sending, input]
  );

  useEffect(() => {
    if (!open) return;
    // Scroll to bottom when opened
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [open]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const send = async () => {
    const text = String(input || "").trim();
    if (!text || sending) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");

    try {
      setSending(true);
      // Do not send the initial greeting to the model.
      const modelMessages = nextMessages.filter(
        (m, idx) => !(idx === 0 && m?.role === "assistant")
      );
      const res = await chatAssistant({ messages: modelMessages });
      const reply = String(res?.reply || "").trim();
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: reply || "Sorry, I couldn't generate a reply. Try again.",
        },
      ]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: e?.message || "AI assistant failed. Please try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  const wrapperClassName =
    variant === "popover"
      ? "fixed left-4 right-4 top-20 z-50 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[360px] sm:max-w-[calc(100vw-2rem)]"
      : "fixed left-4 right-4 bottom-4 z-50 sm:left-auto sm:right-4 sm:w-[380px] sm:max-w-[calc(100vw-2rem)]";

  return (
    <div className={wrapperClassName}>
      <div className="flex max-h-[calc(100vh-6rem)] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl ring-1 ring-black/5 dark:border-neutral-800 dark:bg-black dark:ring-white/10 sm:max-h-[80vh]">
        <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950">
          <div>
            <div className="text-sm font-semibold text-neutral-900 dark:text-white">
              AI Assistant
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Tour ideas • Districts • Events
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900"
            aria-label="Close AI Assistant"
          >
            ✕
          </button>
        </div>

        <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
          <div className="grid gap-2">
            {messages.map((m, idx) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={idx}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white"
                        : "bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              );
            })}
            {sending ? (
              <div className="flex justify-start">
                <div className="max-w-[88%] rounded-2xl bg-neutral-100 px-3.5 py-2.5 text-sm text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
                  Typing...
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="border-t border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-950">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              placeholder="Ask anything..."
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-teal-400/30 dark:border-neutral-800 dark:bg-black dark:text-white dark:placeholder:text-neutral-500"
            />
            <button
              type="button"
              onClick={send}
              disabled={!canSend}
              className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-3 py-2 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-50"
            >
              <span className="hidden sm:inline">Send</span>
              <svg
                aria-hidden="true"
                className="h-4 w-4 sm:ml-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2 11 13" />
                <path d="M22 2 15 22 11 13 2 9 22 2Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


import React, { useEffect, useMemo, useRef, useState } from "react";
import Pusher from "pusher-js";
import { useAuth } from "../../state/AuthContext";
import {
  getConversation,
  getUserConversations,
  sendMessage as sendMessageApi,
  markConversationAsRead,
} from "../../api1/messages";
import {
  getBookingsByTourist,
  getBookingsByProvider,
} from "../../api1/booking";
import { normalizeList } from "../../api1/client";
import { getUserLastSeen } from "../../api1/users";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=60";

function toDisplayName(row) {
  const name = `${row?.first_name || ""} ${row?.last_name || ""}`.trim();
  return name || row?.name || "User";
}

function toConversationId(userA, userB) {
  const a = Number(userA);
  const b = Number(userB);
  const parts = [a, b].sort((x, y) => x - y);
  return `${parts[0]}_${parts[1]}`;
}

function getApiBaseUrl() {
  return import.meta.env?.VITE_API_BASE_URL || "http://localhost:5000/api";
}

function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("token") ||
    ""
  );
}

export default function ChatPanel({ initialGuideId }) {
  const { user } = useAuth();
  const myId = user?.id;
  const myRole = (user?.role || "").toString().toLowerCase();

  const activeChatStorageKey = useMemo(() => {
    if (!myId) return null;
    return `chat_active_user_id_${String(myId)}`;
  }, [myId]);

  const [contacts, setContacts] = useState([]);
  const [activeUserId, setActiveUserId] = useState(initialGuideId || null);
  const [thread, setThread] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingThread, setLoadingThread] = useState(false);
  const [text, setText] = useState("");

  const [activeLastSeen, setActiveLastSeen] = useState(null);

  const pusherRef = useRef(null);
  const channelRef = useRef(null);

  const threadEndRef = useRef(null);

  const contactsById = useMemo(() => {
    const map = new Map();
    contacts.forEach((c) => map.set(String(c.id), c));
    return map;
  }, [contacts]);

  // Restore last active conversation after refresh.
  useEffect(() => {
    if (!myId) return;
    if (initialGuideId) {
      setActiveUserId(initialGuideId);
      return;
    }
    if (!activeChatStorageKey) return;
    const saved = localStorage.getItem(activeChatStorageKey);
    if (saved) setActiveUserId(saved);
  }, [myId, initialGuideId, activeChatStorageKey]);

  // Persist active conversation.
  useEffect(() => {
    if (!activeChatStorageKey) return;
    if (!activeUserId) return;
    localStorage.setItem(activeChatStorageKey, String(activeUserId));
  }, [activeUserId, activeChatStorageKey]);

  useEffect(() => {
    if (!myId) return;
    let mounted = true;

    async function loadContacts() {
      setLoadingContacts(true);
      try {
        // 1) conversations from messages table
        const conv = await getUserConversations(myId).catch(() => []);
        const convList = normalizeList(conv).map((row) => ({
          id: row.other_user_id,
          name: toDisplayName(row),
          avatar: row.profile_picture || FALLBACK_AVATAR,
          role: row.role || "",
          lastMessage: row.last_message || "",
          lastMessageTime: row.last_message_time,
        }));

        // 2) seed contacts from bookings so you can start chat even before any message exists
        const bookings =
          myRole === "local" || myRole === "guide"
            ? await getBookingsByProvider(myId).catch(() => [])
            : await getBookingsByTourist(myId).catch(() => []);

        const bookingList = normalizeList(bookings);
        const bookingContacts = bookingList
          .map((b) => {
            // provider view: tourist is the contact
            if (myRole === "local" || myRole === "guide") {
              const id = b.tourist_id;
              if (!id) return null;
              const name = `${b.first_name || ""} ${b.last_name || ""}`.trim();
              return {
                id,
                name: name || "Tourist",
                avatar: b.profile_picture || FALLBACK_AVATAR,
                role: "tourist",
              };
            }

            // tourist view: guide/provider is the contact
            const id = b.provider_id || b.guide_id;
            if (!id) return null;
            const name = `${b.guide_first_name || ""} ${
              b.guide_last_name || ""
            }`.trim();
            return {
              id,
              name: name || "Local Guide",
              avatar: b.guide_avatar || FALLBACK_AVATAR,
              role: "local",
            };
          })
          .filter(Boolean);

        // merge, prefer conversation metadata (lastMessage)
        const merged = new Map();
        bookingContacts.forEach((c) => merged.set(String(c.id), c));
        convList.forEach((c) =>
          merged.set(String(c.id), { ...merged.get(String(c.id)), ...c })
        );

        const out = Array.from(merged.values());
        if (mounted) {
          setContacts(out);
          if (!activeUserId) setActiveUserId(out[0]?.id ?? null);
        }
      } finally {
        if (mounted) setLoadingContacts(false);
      }
    }

    loadContacts();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myId, myRole]);

  useEffect(() => {
    if (!myId || !activeUserId) return;
    let mounted = true;
    setLoadingThread(true);
    (async () => {
      try {
        const msgs = await getConversation(myId, activeUserId);
        if (!mounted) return;
        setThread(
          normalizeList(msgs).map((m) => ({
            id: String(
              m.message_id ?? `${m.sender_id}_${m.receiver_id}_${m.created_at}`
            ),
            senderId: m.sender_id,
            text: m.message_text,
            createdAt: m.created_at,
            isRead: Boolean(m.is_read),
            readAt: m.read_at || null,
          }))
        );

        // Mark incoming messages as read when opening the thread.
        await markConversationAsRead(activeUserId).catch(() => null);
      } finally {
        if (mounted) setLoadingThread(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [myId, activeUserId]);

  // Always scroll to bottom when messages change.
  useEffect(() => {
    if (loadingThread) return;
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [loadingThread, activeUserId, thread.length]);

  // Last seen for active user
  useEffect(() => {
    if (!activeUserId) {
      setActiveLastSeen(null);
      return;
    }
    let mounted = true;

    const load = async () => {
      try {
        const res = await getUserLastSeen(activeUserId);
        if (!mounted) return;
        setActiveLastSeen(res?.last_seen_at || null);
      } catch {
        if (mounted) setActiveLastSeen(null);
      }
    };

    load();
    const t = setInterval(load, 30000);
    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, [activeUserId]);

  useEffect(() => {
    if (!myId || !activeUserId) return;

    // Create (or reuse) a single Pusher instance
    if (!pusherRef.current) {
      const key =
        import.meta.env?.VITE_PUSHER_KEY ||
        import.meta.env?.VITE_NEXT_PUBLIC_PUSHER_KEY;
      const cluster =
        import.meta.env?.VITE_PUSHER_CLUSTER ||
        import.meta.env?.VITE_NEXT_PUBLIC_PUSHER_CLUSTER;

      if (!key || !cluster) {
        return;
      }

      Pusher.logToConsole = false;
      pusherRef.current = new Pusher(key, {
        cluster,
        authEndpoint: `${getApiBaseUrl()}/pusher/auth`,
        auth: {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      });
    }

    const p = pusherRef.current;
    if (!p) return;

    // Unsubscribe old channel
    if (channelRef.current) {
      channelRef.current.unbind_all();
      p.unsubscribe(channelRef.current.name);
      channelRef.current = null;
    }

    const conversationId = toConversationId(myId, activeUserId);
    const channelName = `private-chat-${conversationId}`;
    const channel = p.subscribe(channelName);
    channelRef.current = channel;

    channel.bind("message:new", (payload) => {
      const msg = payload?.message;
      if (!msg) return;
      // Only append messages for this active conversation.
      const sender = Number(msg.sender_id);
      const receiver = Number(msg.receiver_id);
      const matches =
        (sender === Number(myId) && receiver === Number(activeUserId)) ||
        (sender === Number(activeUserId) && receiver === Number(myId));
      if (!matches) return;
      setThread((prev) => {
        const id = String(
          msg.message_id ??
            `${msg.sender_id}_${msg.receiver_id}_${msg.created_at}`
        );
        if (prev.some((m) => m.id === id)) return prev;
        return [
          ...prev,
          {
            id,
            senderId: msg.sender_id,
            text: msg.message_text,
            createdAt: msg.created_at,
            isRead: Boolean(msg.is_read),
            readAt: msg.read_at || null,
          },
        ];
      });

      // If it's an incoming message for the open thread, mark it read immediately.
      if (Number(msg.receiver_id) === Number(myId)) {
        markConversationAsRead(activeUserId).catch(() => null);
      }
    });

    channel.bind("message:read", (payload) => {
      const messageId = payload?.message_id;
      if (!messageId) return;
      const readAt = payload?.read_at || null;
      setThread((prev) =>
        prev.map((m) =>
          m.id === String(messageId)
            ? { ...m, isRead: true, readAt: readAt || m.readAt }
            : m
        )
      );
    });

    channel.bind("conversation:read", (payload) => {
      const ids = Array.isArray(payload?.message_ids)
        ? payload.message_ids.map((x) => String(x))
        : [];
      if (!ids.length) return;
      const readAt = payload?.read_at || null;
      setThread((prev) =>
        prev.map((m) =>
          ids.includes(String(m.id)) ? { ...m, isRead: true, readAt } : m
        )
      );
    });

    return () => {
      if (channelRef.current) {
        channelRef.current.unbind_all();
        p.unsubscribe(channelRef.current.name);
        channelRef.current = null;
      }
    };
  }, [myId, activeUserId]);

  const onSend = async () => {
    if (!text.trim() || !activeUserId || !myId) return;
    const messageText = text.trim();
    setText("");
    try {
      const created = await sendMessageApi({
        receiver_id: activeUserId,
        message_text: messageText,
      });

      // Optimistic append (Pusher will also deliver; de-dupe by id)
      const id =
        created?.message_id != null ? String(created.message_id) : null;
      setThread((prev) => {
        if (id && prev.some((m) => m.id === id)) return prev;
        return [
          ...prev,
          {
            id: id || `tmp_${Date.now()}`,
            senderId: myId,
            text: messageText,
            createdAt: created?.created_at || new Date().toISOString(),
            isRead: Boolean(created?.is_read),
            readAt: created?.read_at || null,
          },
        ];
      });
    } catch (e) {
      // restore input if failed
      setText(messageText);
      alert(e?.message || "Failed to send message");
    }
  };

  const activeUser = activeUserId
    ? contactsById.get(String(activeUserId))
    : null;

  return (
    <div className="grid gap-4 md:grid-cols-[260px_1fr]">
      {/* Conversations list */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-black">
        <h4 className="mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          Messages
        </h4>
        <div className="space-y-2">
          {loadingContacts && (
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              Loading conversations...
            </div>
          )}
          {!loadingContacts && contacts.length === 0 && (
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              No conversations yet.
            </div>
          )}
          {contacts.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveUserId(c.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-neutral-50 dark:hover:bg-neutral-900 ${
                String(activeUserId) === String(c.id)
                  ? "bg-neutral-50 dark:bg-neutral-900"
                  : ""
              }`}
            >
              <img
                src={c.avatar || FALLBACK_AVATAR}
                className="h-8 w-8 rounded-full object-cover"
                alt={c.name}
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  {c.name}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  {(c.lastMessage || "No messages yet").slice(0, 36)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Message thread */}
      <div className="flex h-[70vh] min-h-[24rem] flex-col rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
        <div className="border-b border-neutral-200 p-3 dark:border-neutral-800">
          <div className="text-sm text-neutral-600 dark:text-neutral-300">
            {activeUserId
              ? `Chat with ${activeUser?.name ?? "User"}`
              : "Select a conversation"}
          </div>
          {activeUserId && activeLastSeen && (
            <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Last seen: {new Date(activeLastSeen).toLocaleString()}
            </div>
          )}
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {loadingThread ? (
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              Loading messages...
            </div>
          ) : thread.length === 0 ? (
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              Say hello to start the conversation.
            </div>
          ) : (
            thread.map((m) => {
              const isMine = Number(m.senderId) === Number(myId);
              const bubble = isMine
                ? "ml-auto bg-green-300 text-black "
                : "bg-gray-300 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200";

              const tickColor = m.isRead ? "text-blue-500" : "text-white/80";
              const tickColorIncoming = m.isRead
                ? "text-blue-500"
                : "text-neutral-400";

              return (
                <div
                  key={m.id}
                  className={`max-w-[80%] ${isMine ? "ml-auto" : ""}`}
                >
                  <div
                    className={`rounded-2xl px-3 py-2 text-sm ${bubble}`}
                    title={
                      m.createdAt ? new Date(m.createdAt).toLocaleString() : ""
                    }
                  >
                    <div>{m.text}</div>
                    <div
                      className={`mt-1 flex items-center justify-end gap-2 text-[11px] ${
                        isMine
                          ? "text-white/80"
                          : "text-neutral-500 dark:text-neutral-400"
                      }`}
                    >
                      {m.createdAt ? (
                        <span>
                          {new Date(m.createdAt).toLocaleTimeString()}
                        </span>
                      ) : null}
                      {isMine ? (
                        <span className={tickColor}>✓✓</span>
                      ) : (
                        <span className={tickColorIncoming}>✓✓</span>
                      )}
                      {isMine && m.isRead && m.readAt ? (
                        <span className="text-blue-500">
                          Seen {new Date(m.readAt).toLocaleTimeString()}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={threadEndRef} />
        </div>

        <div className="flex items-center gap-2 border-t border-neutral-200 p-3 dark:border-neutral-800">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSend()}
            placeholder={
              activeUserId
                ? "Write a message..."
                : "Select a conversation first"
            }
            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400/40 dark:border-neutral-800 dark:bg-black dark:text-neutral-200"
          />
          <button
            onClick={onSend}
            disabled={!activeUserId || !text.trim()}
            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

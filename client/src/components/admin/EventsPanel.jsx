import React, { useEffect, useMemo, useState } from "react";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  updateEvent,
} from "../../api/event";
import Reveal from "../motion/Reveal";
import EventFormModal from "./EventFormModel";

function EventRow({ ev, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-black">
      <img
        src={ev.image || "https://via.placeholder.com/160x100?text=Event"}
        alt={ev.title}
        className="h-16 w-24 rounded-lg object-cover"
      />
      <div className="flex-1">
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          {ev.type}
        </div>
        <div className="text-base font-semibold text-neutral-900 dark:text-white">
          {ev.title}
        </div>
        <div className="text-sm text-neutral-600 dark:text-neutral-300">
          {ev.location} •{" "}
          {ev.startDate ? new Date(ev.startDate).toLocaleDateString() : "-"}{" "}
          {ev.time ? `• ${ev.time}` : ""}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white hover:brightness-105"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function EventsPanel() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAllEvents();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      alert("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter(
      (e) =>
        !s ||
        e.title?.toLowerCase().includes(s) ||
        e.description?.toLowerCase().includes(s) ||
        e.location?.toLowerCase().includes(s)
    );
  }, [items, q]);

  const onSave = async (data) => {
    try {
      if (editing) {
        await updateEvent(editing._id || editing.id, data);
      } else {
        await createEvent(data);
      }
      setOpen(false);
      setEditing(null);
      await load();
    } catch (e) {
      alert(e.message);
    }
  };

  const onDelete = async (ev) => {
    if (!confirm("Delete this event?")) return;
    try {
      await deleteEvent(ev._id || ev.id);
      await load();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white">
          Events
        </h3>
        <div className="flex items-center gap-2">
          <input
            placeholder="Search events..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-400/40 dark:border-neutral-800 dark:bg-black dark:text-neutral-200"
          />
          <button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:brightness-105"
          >
            Create Event
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-500 dark:border-neutral-800 dark:bg-black dark:text-neutral-300">
          Loading...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-500 dark:border-neutral-800 dark:bg-black dark:text-neutral-300">
          No events found.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((ev) => (
            <Reveal key={ev._id || ev.id}>
              <EventRow
                ev={ev}
                onEdit={() => {
                  setEditing(ev);
                  setOpen(true);
                }}
                onDelete={() => onDelete(ev)}
              />
            </Reveal>
          ))}
        </div>
      )}

      <EventFormModal
        open={open}
        initial={editing}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSave={onSave}
      />
    </div>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { createTour, deleteTour, getToursByProvider, updateTour } from "../../api1/tours";
import Reveal from "../motion/Reveal2";
import TourFormModal from "./TourFormModal";
import { normalizeList } from "../../api1/client";

export default function MyToursPanel({ providerId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getToursByProvider(providerId);
      setItems(normalizeList(res));
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (providerId) load();
  }, [providerId]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter(
      (t) =>
        !s ||
        t.title?.toLowerCase().includes(s) ||
        t.description?.toLowerCase().includes(s) ||
        t.location?.toLowerCase().includes(s)
    );
  }, [items, q]);

  const onSave = async (data) => {
    try {
      if (editing) {
        await updateTour(editing._id || editing.id, { ...editing, ...data });
      } else {
        await createTour({ ...data, providerId });
      }
      setOpen(false);
      setEditing(null);
      await load();
    } catch (e) {
      alert(e.message || "Failed to save tour");
    }
  };

  const onDelete = async (t) => {
    if (!confirm("Delete this tour?")) return;
    try {
      await deleteTour(t._id || t.id);
      await load();
    } catch (e) {
      alert(e.message || "Failed to delete");
    }
  };

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <input
          placeholder="Search your tours..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-400/40"
        />
        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:brightness-105"
        >
          + Create New Tour
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-500">
          No tours found.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((t) => (
            <Reveal key={t._id || t.id}>
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                <div className="relative h-48 w-full">
                  <img
                    src={t.image || "https://via.placeholder.com/800x400?text=Tour"}
                    className="h-full w-full object-cover"
                    alt={t.title}
                  />
                  <div className="absolute right-3 top-3">
                    <span className="rounded-full bg-emerald-600 px-2 py-1 text-xs font-semibold text-white">
                      {t.status || "Active"}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-xl font-semibold text-neutral-900">{t.title}</div>
                  <div className="mt-1 text-sm text-neutral-600">
                    {t.location} • {t.durationHours}h • Up to {t.groupSize}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-base font-bold text-teal-700">
                      {t.currency || "$"}
                      {t.price}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditing(t);
                          setOpen(true);
                        }}
                        className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(t)}
                        className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white hover:brightness-105"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      <TourFormModal
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
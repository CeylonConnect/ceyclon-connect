import React, { useEffect, useMemo, useState } from "react";
import {
  createTour,
  deleteTour,
  getToursByProvider,
  updateTour,
} from "../../api1/tours";
import Reveal from "../motion/Reveal2";
import TourFormModal from "./TourFormModal";
import { normalizeList } from "../../api1/client";
import { useAuth } from "../../state/AuthContext";

export default function MyToursPanel({ providerId }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const badgeStatus = (user?.badgeStatus || "none").toString().toLowerCase();
  const role = (user?.role || "").toString().toLowerCase();
  const canCreate =
    (role === "local" || role === "guide") && badgeStatus === "verified";

  const getTourId = (t) => t?._id || t?.id || t?.tour_id;

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
        await updateTour(getTourId(editing), {
          ...editing,
          ...data,
          providerId,
        });
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
      await deleteTour(getTourId(t));
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
          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-400/40 dark:border-neutral-800 dark:bg-black dark:text-neutral-200"
        />
        <button
          onClick={() => {
            if (!canCreate) {
              alert(
                "Your badge request must be approved before creating tours"
              );
              return;
            }
            setEditing(null);
            setOpen(true);
          }}
          disabled={!canCreate}
          className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:brightness-105"
        >
          + Create New Tour
        </button>
      </div>

      {!canCreate && (
        <div className="mb-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          Tour creation is locked until your verification badge is approved.
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-500 dark:border-neutral-800 dark:bg-black dark:text-neutral-300">
          Loading...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-500 dark:border-neutral-800 dark:bg-black dark:text-neutral-300">
          No tours found.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((t) => (
            <Reveal key={getTourId(t)}>
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-black">
                <div className="relative h-48 w-full">
                  <img
                    src={
                      t.image ||
                      t.images?.[0] ||
                      "https://via.placeholder.com/800x400?text=Tour"
                    }
                    className="h-full w-full object-cover"
                    alt={t.title}
                  />
                  <div className="absolute right-3 top-3">
                    <span className="rounded-full bg-emerald-600 px-2 py-1 text-xs font-semibold text-white">
                      {t.status ||
                        (t.availability === false ? "Inactive" : "Active")}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-xl font-semibold text-neutral-900 dark:text-white">
                    {t.title}
                  </div>
                  <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                    {t.location || t.district} •{" "}
                    {(t.durationHours ?? t.duration_hours) || 0}h • Up to{" "}
                    {(t.groupSize ?? t.max_group_size) || 0}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-base font-bold text-teal-700">
                      {t.currency || "Rs. "}
                      {t.price}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditing(t);
                          setOpen(true);
                        }}
                        className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900"
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

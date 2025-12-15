import React, { useEffect, useMemo, useState } from "react";
import { getBookingsByProvider, updateBookingStatus } from "../../api1/booking";
import Reveal from "../motion/Reveal2";
import { normalizeList } from "../../api1/client";

function StatusChip({ v }) {
  const map = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-emerald-100 text-emerald-700",
    declined: "bg-rose-100 text-rose-700",
    completed: "bg-teal-100 text-teal-700",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${map[v] || "bg-neutral-100 text-neutral-700"}`}>
      {v}
    </span>
  );
}

export default function BookingsPanel({ providerId }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getBookingsByProvider(providerId);
      setList(normalizeList(res));
    } catch (e) {
      setError(e.message || "Failed to load bookings");
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (providerId) load();
  }, [providerId]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return list.filter(
      (b) =>
        !s ||
        b.tour?.title?.toLowerCase().includes(s) ||
        b.tourist?.name?.toLowerCase().includes(s) ||
        b.status?.toLowerCase().includes(s)
    );
  }, [list, q]);

  const setStatus = async (b, status) => {
    try {
      await updateBookingStatus(b._id || b.id, status);
      setList((prev) =>
        prev.map((x) => (x._id === b._id || x.id === b.id ? { ...x, status } : x))
      );
    } catch (e) {
      alert(e.message || "Failed to update status");
    }
  };

  const totalRevenue = filtered
    .filter((b) => ["approved", "completed"].includes(b.status))
    .reduce((sum, b) => sum + Number(b.total || b.tour?.price || 0), 0);

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <input
          placeholder="Search bookings..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-400/40"
        />
        <div className="text-sm text-neutral-600">
          Revenue (approved/completed):{" "}
          <span className="font-semibold text-teal-700">${totalRevenue}</span>
        </div>
      </div>

      {error && (
        <div className="mb-3 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-500">
          No bookings found.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => {
            const id = b._id || b.id;
            const status = b.status || "pending";
            return (
              <Reveal key={id}>
                <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
                  <img
                    src={b.tour?.image || "https://via.placeholder.com/160x100?text=Tour"}
                    alt={b.tour?.title}
                    className="h-20 w-28 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="text-base font-semibold text-neutral-900">
                        {b.tour?.title || "Tour"}
                      </div>
                      <StatusChip v={status} />
                    </div>
                    <div className="mt-1 text-sm text-neutral-600">
                      {b.date ? new Date(b.date).toLocaleDateString() : "-"} • {b.guests || 1}{" "}
                      {b.guests > 1 ? "people" : "person"} • {b.tour?.currency || "$"}
                      {b.total || b.tour?.price || 0}
                    </div>
                    <div className="text-xs text-neutral-500">
                      Tourist: {b.tourist?.name || "-"} ({b.tourist?.email || "no email"})
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {status === "pending" && (
                      <>
                        <button
                          onClick={() => setStatus(b, "approved")}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setStatus(b, "declined")}
                          className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {["approved"].includes(status) && (
                      <button
                        onClick={() => setStatus(b, "completed")}
                        className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-semibold text-white"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
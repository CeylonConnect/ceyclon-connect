import React, { useEffect, useMemo, useState } from "react";
import { getBookingsByProvider, updateBookingStatus } from "../../api1/booking";
import Reveal from "../motion/Reveal2";
import { normalizeList } from "../../api1/client";

function coerceArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      if (value.includes(",")) {
        return value
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);
      }
    }
    return [value];
  }
  return [];
}

function StatusChip({ v }) {
  const map = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-emerald-100 text-emerald-700",
    confirmed: "bg-emerald-100 text-emerald-700",
    declined: "bg-rose-100 text-rose-700",
    cancelled: "bg-rose-100 text-rose-700",
    completed: "bg-teal-100 text-teal-700",
  };
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        map[v] || "bg-neutral-100 text-neutral-700"
      }`}
    >
      {v}
    </span>
  );
}

export default function BookingsPanel({ providerId }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  const getRowId = (row) => row?.booking_id || row?._id || row?.id;

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
        (b.tour?.title || b.title || b.tour_title || "")
          .toLowerCase()
          .includes(s) ||
        (
          b.tourist?.name ||
          `${b.first_name || ""} ${b.last_name || ""}`.trim() ||
          ""
        )
          .toLowerCase()
          .includes(s) ||
        b.status?.toLowerCase().includes(s)
    );
  }, [list, q]);

  const setStatus = async (b, status) => {
    try {
      const targetId = getRowId(b);
      await updateBookingStatus(targetId, status);
      setList((prev) =>
        prev.map((x) => (getRowId(x) === targetId ? { ...x, status } : x))
      );
    } catch (e) {
      alert(e.message || "Failed to update status");
    }
  };

  const totalRevenue = filtered
    .filter((b) => ["approved", "confirmed", "completed"].includes(b.status))
    .reduce(
      (sum, b) =>
        sum +
        Number(b.total || b.total_amount || b.tour?.price || b.price || 0),
      0
    );

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <input
          placeholder="Search bookings..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-400/40 dark:border-neutral-800 dark:bg-black dark:text-neutral-200"
        />
        <div className="text-sm text-neutral-600 dark:text-neutral-300">
          Revenue (approved/completed):{" "}
          <span className="font-semibold text-teal-700">
            Rs. {totalRevenue}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-3 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-950/30 dark:text-rose-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-500 dark:border-neutral-800 dark:bg-black dark:text-neutral-300">
          Loading...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-500 dark:border-neutral-800 dark:bg-black dark:text-neutral-300">
          No bookings found.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => {
            const id = b.booking_id || b._id || b.id;
            const status = b.status || "pending";

            const images = coerceArray(b.images || b.tour_images);
            const tourTitle =
              b.tour?.title || b.title || b.tour_title || "Tour";
            const tourImage =
              b.tour?.image ||
              b.image ||
              images[0] ||
              "https://via.placeholder.com/160x100?text=Tour";
            const tourCurrency = b.tour?.currency || b.currency || "Rs. ";
            const total =
              b.total || b.total_amount || b.tour?.price || b.price || 0;
            const guests = b.guests || b.group_size || 1;
            const dateValue = b.date || b.tour_date;
            const touristName =
              b.tourist?.name ||
              `${b.first_name || ""} ${b.last_name || ""}`.trim() ||
              "-";
            const touristEmail = b.tourist?.email || b.email || "no email";
            return (
              <Reveal key={id}>
                <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm md:flex-row md:items-center dark:border-neutral-800 dark:bg-black">
                  <img
                    src={tourImage}
                    alt={tourTitle}
                    className="h-20 w-28 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="text-base font-semibold text-neutral-900 dark:text-white">
                        {tourTitle}
                      </div>
                      <StatusChip v={status} />
                    </div>
                    <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                      {dateValue
                        ? new Date(dateValue).toLocaleDateString()
                        : "-"}{" "}
                      • {guests} {guests > 1 ? "people" : "person"} •{" "}
                      {tourCurrency}
                      {total}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      Tourist: {touristName} ({touristEmail})
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {status === "pending" && (
                      <>
                        <button
                          onClick={() => setStatus(b, "confirmed")}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setStatus(b, "cancelled")}
                          className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {["approved", "confirmed"].includes(status) && (
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

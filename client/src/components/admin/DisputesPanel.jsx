import React, { useEffect, useMemo, useState } from "react";
import {
  deleteDispute,
  getAllDisputes,
  updateDispute,
} from "../../api/distipute";
import Reveal from "../motion/Reveal1";

function StatusDot({ status = "open" }) {
  const map = {
    open: "bg-amber-500",
    resolved: "bg-emerald-600",
    escalated: "bg-rose-600",
  };
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${
        map[status] || "bg-neutral-400"
      }`}
    />
  );
}

export default function DisputesPanel() {
  const [disputes, setDisputes] = useState([]); // always an array
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllDisputes(q ? `q=${encodeURIComponent(q)}` : "");
      setDisputes(Array.isArray(data) ? data : []); // guard
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to load disputes");
      setDisputes([]); // ensure array to avoid .map crash
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = () => load();

  const setStatus = async (id, status) => {
    try {
      const resolution =
        status === "resolved" || status === "closed"
          ? window.prompt("Add a resolution note (optional):", "") || ""
          : undefined;

      await updateDispute(id, {
        status,
        ...(resolution !== undefined ? { resolution } : {}),
      });

      // Optimistic update
      setDisputes((prev) =>
        prev.map((d) =>
          Number(d.dispute_id) === Number(id)
            ? {
                ...d,
                status,
                ...(resolution !== undefined ? { resolution } : {}),
              }
            : d
        )
      );
    } catch (e) {
      alert(e.message || "Failed to update status");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this dispute?")) return;
    try {
      await deleteDispute(id);
      setDisputes((prev) =>
        prev.filter((d) => Number(d.dispute_id) !== Number(id))
      );
    } catch (e) {
      alert(e.message || "Failed to delete dispute");
    }
  };

  // Final guard before render
  const list = useMemo(
    () => (Array.isArray(disputes) ? disputes : []),
    [disputes]
  );

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white">
          Disputes
        </h3>
        <div className="flex items-center gap-2">
          <input
            placeholder="Search disputes..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-400/40 dark:border-neutral-800 dark:bg-black dark:text-neutral-200"
          />
          <button
            onClick={onSearch}
            className="rounded-lg bg-neutral-900 px-3 py-2 text-sm font-semibold text-white"
          >
            Search
          </button>
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
      ) : list.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-500 dark:border-neutral-800 dark:bg-black dark:text-neutral-300">
          No disputes.
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((d) => {
            const id = d.dispute_id;
            const status = d.status || "open";
            return (
              <Reveal key={id}>
                <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-black">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                        <StatusDot status={status} />
                        <span className="font-medium capitalize">{status}</span>
                      </div>
                      <div className="mt-1 text-base font-semibold text-neutral-900 dark:text-white">
                        {d.type ? String(d.type) : "Dispute"}
                      </div>
                      <div className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                        {d.description || "-"}
                      </div>
                      <div className="mt-2 text-xs text-neutral-600 dark:text-neutral-300">
                        Booking: #{d.booking_id}{" "}
                        {d.tour_title ? `• ${d.tour_title}` : ""}
                      </div>
                      <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">
                        From: {d.complainant_first_name || ""}{" "}
                        {d.complainant_last_name || ""}→ To:{" "}
                        {d.accused_first_name || ""} {d.accused_last_name || ""}
                      </div>
                      <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                        Opened:{" "}
                        {d.created_at
                          ? new Date(d.created_at).toLocaleString()
                          : "-"}
                      </div>
                      {d.resolution ? (
                        <div className="mt-2 rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
                          <div className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                            Resolution
                          </div>
                          <div className="mt-1">{d.resolution}</div>
                        </div>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      {status !== "resolved" && (
                        <button
                          onClick={() => setStatus(id, "resolved")}
                          className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
                        >
                          Mark resolved
                        </button>
                      )}
                      {status === "open" && (
                        <button
                          onClick={() => setStatus(id, "in_progress")}
                          className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white"
                        >
                          In progress
                        </button>
                      )}
                      <button
                        onClick={() => remove(id)}
                        className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white"
                      >
                        Delete
                      </button>
                    </div>
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

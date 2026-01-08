import React, { useEffect, useState } from "react";
import {
  getAllBadgeRequests,
  updateBadgeRequestStatus,
} from "../../api/badgeRequest";
import Reveal from "../motion/Reveal1";

function StatusChip({ status }) {
  const map = {
    approved:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200",
    rejected:
      "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200",
    pending:
      "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200",
  };
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        map[status] ||
        "bg-neutral-100 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
      }`}
    >
      {status}
    </span>
  );
}

export default function BadgeRequestsPanel() {
  const [requests, setRequests] = useState([]); // always start as array
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [pendingCount, setPendingCount] = useState(0);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      // Normalize in API; still guard here
      const list = await getAllBadgeRequests(
        filter !== "all" ? filter : undefined
      );
      setRequests(Array.isArray(list) ? list : []);
      const pendingList = await getAllBadgeRequests("pending");
      setPendingCount(
        Array.isArray(pendingList)
          ? pendingList.length
          : Number(pendingList?.count || 0)
      );
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to load badge requests");
      setRequests([]); // ensure array to avoid .map crash
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const changeStatus = async (id, status) => {
    const adminNotes =
      status === "rejected" ? prompt("Reason (optional):", "") : "";
    try {
      await updateBadgeRequestStatus(id, {
        status,
        adminNotes,
      });
      await load();
    } catch (e) {
      alert(e.message || "Failed to update status");
    }
  };

  // Extra guard: never let rendering call .map on a non-array
  const safeRequests = Array.isArray(requests) ? requests : [];

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white">
          Badge Verification Requests
        </h3>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-500/15 dark:text-orange-200">
            {pendingCount} Pending
          </span>
          <select
            className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-black dark:text-neutral-200"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All</option>
          </select>
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
      ) : safeRequests.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-500 dark:border-neutral-800 dark:bg-black dark:text-neutral-300">
          No badge requests.
        </div>
      ) : (
        <div className="space-y-4">
          {safeRequests.map((r) => {
            const id = r.request_id || r.id || r._id;
            const name =
              r.name ||
              r.userName ||
              r.user?.name ||
              `${r.first_name || ""} ${r.last_name || ""}`.trim() ||
              "Guide";
            const email = r.email || r.user?.email || "-";
            const submittedAt = r.submitted_at || r.createdAt;
            return (
              <Reveal key={id}>
                <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center dark:border-neutral-800 dark:bg-black">
                  <div className="flex-1">
                    <div className="text-base font-semibold text-neutral-900 dark:text-white">
                      {name}
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-300">
                      {email}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      Submitted:{" "}
                      {submittedAt
                        ? new Date(submittedAt).toLocaleDateString()
                        : "-"}
                    </div>
                  </div>
                  <StatusChip status={r.status || "pending"} />
                  <div className="flex gap-2">
                    {r.status !== "approved" && (
                      <button
                        onClick={() => changeStatus(id, "approved")}
                        className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:brightness-105"
                      >
                        Approve
                      </button>
                    )}
                    {r.status !== "rejected" && (
                      <button
                        onClick={() => changeStatus(id, "rejected")}
                        className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:brightness-105"
                      >
                        Reject
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

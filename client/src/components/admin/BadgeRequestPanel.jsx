import React, { useEffect, useState } from "react";
import { getAllBadgeRequests, updateBadgeRequestStatus } from "../../api/badgeRequest";
import Reveal from "../motion/Reveal1";

function StatusChip({ status }) {
  const map = {
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-rose-100 text-rose-700",
    pending: "bg-amber-100 text-amber-800",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${map[status] || "bg-neutral-100 text-neutral-700"}`}>
      {status}
    </span>
  );
}

export default function BadgeRequestsPanel() {
  const [requests, setRequests] = useState([]);          // always start as array
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [pendingCount, setPendingCount] = useState(0);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      // Normalize in API; still guard here
      const list = await getAllBadgeRequests(filter !== "all" ? filter : undefined);
      setRequests(Array.isArray(list) ? list : []);
      const pendingList = await getAllBadgeRequests("pending");
      setPendingCount(Array.isArray(pendingList) ? pendingList.length : Number(pendingList?.count || 0));
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
    const adminNotes = status === "rejected" ? prompt("Reason (optional):", "") : "";
    try {
      await updateBadgeRequestStatus(id, {
        status,
        reviewedBy: "admin@ceylonconnect.lk",
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
        <h3 className="text-xl font-extrabold text-neutral-900">Badge Verification Requests</h3>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
            {pendingCount} Pending
          </span>
          <select
            className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm"
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
        <div className="mb-3 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-500">
          Loading...
        </div>
      ) : safeRequests.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-500">
          No badge requests.
        </div>
      ) : (
        <div className="space-y-4">
          {safeRequests.map((r) => {
            const id = r.id || r._id;
            return (
              <Reveal key={id}>
                <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <div className="text-base font-semibold text-neutral-900">
                      {r.name || r.userName || r.user?.name || "Guide"}
                    </div>
                    <div className="text-sm text-neutral-600">{r.email || r.user?.email || "-"}</div>
                    <div className="text-xs text-neutral-500">
                      Submitted: {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"}
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
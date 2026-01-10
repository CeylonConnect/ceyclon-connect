import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../state/AuthContext";
import { createDispute, getMyDisputes } from "../api/distipute";
import { getBookingsByProvider, getBookingsByTourist } from "../api1/booking";
import { normalizeList } from "../api1/client";

function formatBookingLabel(b) {
  const id = b.booking_id ?? b.id;
  const title = b.tour_title || b.title || "Tour";
  const date = b.tour_date || b.date || "";
  return `#${id} • ${title}${date ? ` • ${date}` : ""}`;
}

function StatusPill({ status }) {
  const s = String(status || "open").toLowerCase();
  const map = {
    open: "border-amber-200 bg-amber-50 text-amber-800",
    in_progress: "border-sky-200 bg-sky-50 text-sky-800",
    resolved: "border-emerald-200 bg-emerald-50 text-emerald-800",
    closed: "border-neutral-200 bg-neutral-50 text-neutral-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
        map[s] || "border-neutral-200 bg-neutral-50 text-neutral-700"
      }`}
    >
      {s.replace("_", " ")}
    </span>
  );
}

export default function HelpCenter() {
  const { user, initializing } = useAuth();
  const role = String(user?.role || "").toLowerCase();
  const userId = user?.id || user?.user_id;

  const [bookings, setBookings] = useState([]);
  const [bookingId, setBookingId] = useState("");
  const [type, setType] = useState("general");
  const [description, setDescription] = useState("");

  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canSubmit = role === "tourist" || role === "local" || role === "guide";

  const load = async () => {
    if (!userId || !canSubmit) return;
    setLoading(true);
    setError("");
    try {
      const [b, d] = await Promise.all([
        (role === "tourist"
          ? getBookingsByTourist(userId)
          : getBookingsByProvider(userId)
        ).catch(() => []),
        getMyDisputes().catch(() => []),
      ]);

      const list = normalizeList(b);
      setBookings(Array.isArray(list) ? list : []);

      setDisputes(Array.isArray(d) ? d : []);

      // Pick first booking by default
      if (!bookingId && Array.isArray(list) && list.length > 0) {
        const first = list[0];
        setBookingId(String(first.booking_id ?? first.id ?? ""));
      }
    } catch (e) {
      setError(e?.message || "Failed to load Help Center data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, role]);

  const bookingOptions = useMemo(() => {
    const list = Array.isArray(bookings) ? bookings : [];
    return list
      .map((b) => {
        const id = b.booking_id ?? b.id;
        return {
          id: String(id),
          label: formatBookingLabel(b),
        };
      })
      .filter((o) => o.id && o.id !== "undefined");
  }, [bookings]);

  const submit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!canSubmit) {
      setError("Only tourists and locals can submit disputes.");
      return;
    }
    if (!bookingId) {
      setError("Please select a booking.");
      return;
    }
    if (!description.trim()) {
      setError("Please enter a description.");
      return;
    }

    try {
      await createDispute({
        booking_id: Number(bookingId),
        type,
        description,
      });
      setDescription("");
      setSuccess("Your report has been submitted. Our team will review it shortly.");
      await load();
    } catch (e2) {
      setError(e2?.message || "Failed to submit dispute");
    }
  };

  return (
    <>
      <Navbar />
      <main className="bg-sand-50">
        <section className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="text-3xl font-extrabold text-neutral-900">
            Help Center
          </h1>
          <p className="mt-2 text-neutral-600">
            Report an issue with a booking and track its status.
          </p>

          {initializing ? (
            <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-600">
              Loading...
            </div>
          ) : !user ? (
            <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
              <div className="text-neutral-800 font-semibold">
                You are not logged in.
              </div>
              <p className="mt-1 text-sm text-neutral-600">
                Please log in to submit a dispute.
              </p>
              <a
                href="/login?next=/help-center"
                className="mt-4 inline-flex rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Go to Login
              </a>
            </div>
          ) : !canSubmit ? (
            <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-600">
             Dispute submission functionality is available to both tourist and local user roles.
            </div>
          ) : (
            <>
              {(error || success) && (
                <div
                  className={`mt-6 rounded-2xl border p-4 text-sm ${
                    error
                      ? "border-rose-200 bg-rose-50 text-rose-800"
                      : "border-emerald-200 bg-emerald-50 text-emerald-800"
                  }`}
                >
                  {error || success}
                </div>
              )}

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-neutral-900">
                    Report an Issue
                  </h2>
                  <form className="mt-4 space-y-4" onSubmit={submit}>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-600">
                        Booking
                      </label>
                      <select
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value)}
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400/40"
                      >
                        {bookingOptions.length === 0 ? (
                          <option value="">No bookings found</option>
                        ) : (
                          bookingOptions.map((o) => (
                            <option key={o.id} value={o.id}>
                              {o.label}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-600">
                        Type
                      </label>
                      <input
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        placeholder="e.g. payment, behavior, schedule"
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400/40"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-600">
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={5}
                        placeholder="Explain the problem and what happened..."
                        className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400/40"
                      />
                    </div>

                    <button
                      disabled={loading || bookingOptions.length === 0}
                      className="inline-flex rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {loading ? "Sending..." : "Report an Issue"}
                    </button>
                  </form>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-neutral-900">
                    Your Reports
                  </h2>
                  {loading ? (
                    <div className="mt-4 text-sm text-neutral-600">
                      Loading...
                    </div>
                  ) : disputes.length === 0 ? (
                    <div className="mt-4 text-sm text-neutral-600">
                     No reports yet.
                    </div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {disputes.map((d) => (
                        <div
                          key={d.dispute_id}
                          className="rounded-2xl border border-neutral-200 bg-white p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm font-semibold text-neutral-900">
                                {d.tour_title || "Booking"} • #{d.booking_id}
                              </div>
                              <div className="mt-1 text-xs text-neutral-500">
                                {d.created_at
                                  ? new Date(d.created_at).toLocaleString()
                                  : ""}
                              </div>
                            </div>
                            <StatusPill status={d.status} />
                          </div>

                          <div className="mt-2 text-sm text-neutral-700">
                            <span className="font-medium">Type:</span>{" "}
                            {d.type || "-"}
                          </div>
                          <div className="mt-1 text-sm text-neutral-700">
                            {d.description}
                          </div>

                          {d.resolution ? (
                            <div className="mt-2 rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-700">
                              <div className="text-xs font-semibold text-neutral-600">
                                Resolution
                              </div>
                              <div className="mt-1">{d.resolution}</div>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}


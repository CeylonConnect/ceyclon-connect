import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { useBooking } from "../state/BookingContext";
import BookingItem from "../components/dashboard/BookingItem";
import ChatPanel from "../components/dashboard/ChatPanel";
import { useLocation, useNavigate } from "react-router-dom";
import Avatar from "../components/ui/avatar";
import { useAuth } from "../state/AuthContext";

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="text-sm text-neutral-600">{label}</div>
      <div className="mt-3 text-3xl font-bold text-neutral-900">{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const {
    bookings,
    updateBookingStatus,
    loadBookings,
    loading: bookingsLoading,
    error: bookingsError,
  } = useBooking();
  const [tab, setTab] = useState("bookings");
  const { user, setUser, initializing } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Read banner param
  const justBooked = new URLSearchParams(location.search).get("booking");

  useEffect(() => {
    if (!initializing && !user) {
      navigate(`/login?next=${encodeURIComponent("/dashboard")}`, {
        replace: true,
      });
    }
  }, [initializing, user, navigate]);

  useEffect(() => {
    if (!user?.id) return;
    loadBookings({ userId: user.id, role: "tourist" }).catch(() => {
      /* errors handled in context */
    });
  }, [user?.id, loadBookings]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const upcoming = bookings.filter((b) => b.status !== "cancelled").length;
    const spent = bookings.reduce((sum, b) => sum + Number(b.total || 0), 0);
    return { total, upcoming, spent };
  }, [bookings]);


  if (initializing || !user) {
    return (
      <>
        <Navbar />
        <main className="bg-sand-50">
          <section className="mx-auto max-w-6xl px-4 py-16 text-center text-neutral-600">
            {initializing ? "Loading your dashboard..." : "Redirecting to login..."}
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-sand-50">
        <section className="mx-auto max-w-6xl px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Avatar
              src={user.avatar}
              name={`${user.firstName || ""} ${user.lastName || ""}`.trim()}
              email={user.email}
              size={56}
              className="ring-2 ring-white shadow"
            />
            <div>
              <h1 className="text-3xl font-extrabold text-neutral-900">
                Welcome back, {user.firstName || "Traveler"}!
              </h1>
              <p className="text-neutral-600">Manage your bookings and profile</p>
            </div>
          </div>

          {justBooked && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Pending local approval. Your guide will review and contact you in Messages.
            </div>
          )}

          {/* Tabs */}
          <div className="mt-6 flex gap-2">
            {[
              { id: "bookings", label: "My Bookings" },
              { id: "messages", label: "Messages" },
              { id: "profile", label: "Profile" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                  tab === t.id ? "bg-white shadow-sm" : "bg-transparent hover:bg-white/60"
                } border border-neutral-200 text-neutral-800`}
              >
                {t.label}
              </button>
            ))}
            <a
              href="/tours"
              className="ml-auto rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:brightness-105"
            >
              Book New Tour
            </a>
          </div>

          {tab === "bookings" && (
            <>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <StatCard label="Total Bookings" value={stats.total} />
                <StatCard label="Upcoming Tours" value={stats.upcoming} />
                <StatCard label="Total Spent" value={`$${stats.spent}`} />
              </div>

              <h2 className="mt-8 text-2xl font-extrabold text-neutral-900">Your Bookings</h2>
              <div className="mt-4 space-y-4">
                {bookingsLoading && (
                  <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-600">
                    Loading bookings...
                  </div>
                )}
                {!bookingsLoading && bookingsError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {bookingsError}
                  </div>
                )}
                {!bookingsLoading && bookings.length === 0 && !bookingsError && (
                  <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-600">
                    You have no bookings yet.
                  </div>
                )}
                {!bookingsLoading &&
                  bookings.map((b) => (
                    <BookingItem
                      key={b.id}
                      booking={b}
                      onApprove={(id) => updateBookingStatus(id, "confirmed")}
                      onMessage={(bkg) => {
                        setTab("messages");
                        navigate(`/dashboard?chat=${bkg.guide.id}`, { replace: true });
                      }}
                    />
                  ))}
              </div>
            </>
          )}

          {tab === "messages" && (
            <div className="mt-6">
              <ChatPanel
                initialGuideId={
                  new URLSearchParams(location.search).get("chat") || undefined
                }
              />
            </div>
          )}

          {tab === "profile" && (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-neutral-800">Profile</h3>
                <form
                  className="mt-4 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    setUser((u) => ({
                      ...u,
                      firstName: fd.get("firstName"),
                      lastName: fd.get("lastName"),
                      email: fd.get("email"),
                      phone: fd.get("phone"),
                    }));
                    alert("Profile updated!");
                  }}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-600">
                        First Name
                      </label>
                      <input
                        name="firstName"
                        defaultValue={user.firstName}
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400/40"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-600">
                        Last Name
                      </label>
                      <input
                        name="lastName"
                        defaultValue={user.lastName}
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400/40"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-600">
                        Email
                      </label>
                      <input
                        name="email"
                        type="email"
                        defaultValue={user.email}
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400/40"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-600">
                        Phone
                      </label>
                      <input
                        name="phone"
                        defaultValue={user.phone}
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400/40"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white">
                      Save changes
                    </button>
                  </div>
                </form>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-neutral-800">Account</h3>
                <p className="mt-2 text-sm text-neutral-600">
                  Update your information and manage your account security.
                </p>
                <a
                  href="/tours"
                  className="mt-6 inline-flex rounded-xl border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Browse more tours
                </a>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
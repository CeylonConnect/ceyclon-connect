import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { useBooking } from "../state/BookingContext";
import BookingItem from "../components/dashboard/BookingItem";
import ChatPanel from "../components/dashboard/ChatPanel";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Avatar from "../components/ui/avatar";
import { useAuth } from "../state/AuthContext";

function StatCard({ label, value }) {
  return (
    <div className="p-6 bg-white border shadow-sm rounded-2xl border-neutral-200">
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

  const { user, setUser, initializing } = useAuth();
  const [tab, setTab] = useState("bookings");

  const navigate = useNavigate();
  const location = useLocation();

  // ---------------------------
  // Safe display name
  // ---------------------------
  const firstName = user?.firstName || user?.first_name || "";
  const lastName = user?.lastName || user?.last_name || "";

  const displayName =
    firstName || lastName ? `${firstName} ${lastName}`.trim() : "Traveler";

  const justBooked = new URLSearchParams(location.search).get("booking");

  // Redirect if not logged in
  useEffect(() => {
    if (!initializing && !user) {
      navigate(`/login?next=${encodeURIComponent("/dashboard")}`, {
        replace: true,
      });
    }
  }, [initializing, user, navigate]);

  // Load bookings
  useEffect(() => {
    if (!user?.user_id) return;

    loadBookings({
      userId: user.user_id,
      role: user.role,
    }).catch(() => {});
  }, [user?.user_id, user?.role, loadBookings]);

  
  // Stats
  const stats = useMemo(() => {
    const total = bookings.length;
    const upcoming = bookings.filter((b) => b.status !== "cancelled").length;
    const spent = bookings.reduce(
      (sum, b) => sum + Number(b.total_amount || 0),
      0
    );
    return { total, upcoming, spent };
  }, [bookings]);

  if (initializing || !user) {
    return (
      <>
        <Navbar />
        <main className="bg-sand-50">
          <section className="max-w-6xl px-4 py-16 mx-auto text-center text-neutral-600">
            {initializing
              ? "Loading your dashboard..."
              : "Redirecting to login..."}
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-sand-50">
        <section className="max-w-6xl px-4 py-8 mx-auto">

          {/* Header */}
          <div className="flex items-center gap-4">
            <Avatar
              src={user.avatar}
              name={displayName}
              email={user.email}
              size={56}
              className="shadow ring-2 ring-white"
            />
            <div>
              <h1 className="text-3xl font-extrabold text-neutral-900">
                Welcome back, {displayName}!
              </h1>
              <p className="text-neutral-600">
                Manage your bookings and profile
              </p>
            </div>
          </div>

          {justBooked && (
            <div className="p-3 mt-4 text-sm border rounded-xl border-amber-200 bg-amber-50 text-amber-800">
              Pending local approval. Your guide will review and contact you in Messages.
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            {[
              { id: "bookings", label: "My Bookings" },
              { id: "messages", label: "Messages" },
              { id: "profile", label: "Profile" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                  tab === t.id
                    ? "bg-white shadow-sm"
                    : "bg-transparent hover:bg-white/60"
                } border border-neutral-200 text-neutral-800`}
              >
                {t.label}
              </button>
            ))}

            {/* Tourist */}
            {user?.role === "tourist" && (
              <Link
                to="/tours"
                className="px-4 py-2 ml-auto text-sm font-semibold text-white bg-orange-500 rounded-xl"
              >
                Book New Tour
              </Link>
            )}

            {/* Guide */}
            {user?.role === "guide" && (
              <Link
                to="/guide/tours"
                className="px-4 py-2 ml-auto text-sm font-semibold text-white bg-neutral-900 rounded-xl"
              >
                Manage My Tours
              </Link>
            )}
          </div>

          {/* Bookings */}
          {tab === "bookings" && (
            <>
              <div className="grid gap-4 mt-6 md:grid-cols-3">
                <StatCard label="Total Bookings" value={stats.total} />
                <StatCard label="Upcoming Tours" value={stats.upcoming} />
                <StatCard label="Total Spent" value={`$${stats.spent}`} />
              </div>

              <h2 className="mt-8 text-2xl font-extrabold text-neutral-900">
                Your Bookings
              </h2>

              <div className="mt-4 space-y-4">
                {bookingsLoading && (
                  <div className="p-8 text-center bg-white border rounded-2xl border-neutral-200 text-neutral-600">
                    Loading bookings...
                  </div>
                )}

                {!bookingsLoading && bookingsError && (
                  <div className="p-4 text-sm text-red-700 border border-red-200 rounded-2xl bg-red-50">
                    {bookingsError}
                  </div>
                )}

                {!bookingsLoading &&
                  bookings.length === 0 &&
                  !bookingsError && (
                    <div className="p-8 text-center bg-white border rounded-2xl border-neutral-200 text-neutral-600">
                      You have no bookings yet.
                    </div>
                  )}

                {!bookingsLoading &&
                  bookings.map((b) => (
                    <BookingItem
                      key={b.booking_id}
                      booking={b}
                      onApprove={(id) =>
                        updateBookingStatus(id, "confirmed")
                      }
                      onMessage={(bkg) => {
                        setTab("messages");
                        navigate(`/dashboard?chat=${bkg.provider_id}`, {
                          replace: true,
                        });
                      }}
                    />
                  ))}
              </div>
            </>
          )}

          {/* Messages */}
          {tab === "messages" && (
            <div className="mt-6">
              <ChatPanel
                initialGuideId={
                  new URLSearchParams(location.search).get("chat") || undefined
                }
              />
            </div>
          )}

          {/* Profile */}
          {tab === "profile" && (
            <div className="grid gap-4 mt-6 md:grid-cols-2">
              <div className="p-6 bg-white border shadow-sm rounded-2xl border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-800">
                  Profile
                </h3>

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
                  {/* your inputs */}
                </form>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}


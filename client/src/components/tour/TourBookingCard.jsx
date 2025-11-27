import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../state/AuthContext";
import { useBooking } from "../../state/BookingContext";

export default function TourBookingCard({ price, currency, title, rating, maxGroup, tour, guide }) {
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(2);
  const { user } = useAuth();
  const { createBooking } = useBooking();
  const navigate = useNavigate();
  const location = useLocation();

const total = useMemo(() => {
    const p = Number(price || 0);
    return (p * Math.max(1, guests)).toFixed(2);
  }, [price, guests]);

  const onBook = () => {
    if (!user) {
      // Redirect to login, then back to this tour after login
      const nextUrl = `/login?next=${encodeURIComponent(location.pathname + location.search)}&msg=${encodeURIComponent("Please login to continue the booking.")}`;
      navigate(nextUrl);
      return;
    }
    if (!date) {
      alert("Please select a date.");
      return;
    }
    const booking = createBooking({
      tour: tour || { title, price, currency },
      guide:
        guide || {
          id: "g_demo",
          name: "Sarah Perera",
          avatar: "https://i.pravatar.cc/96?img=45",
          verified: true,
        },
      date,
      guests,
    });
    // Navigate to dashboard where the banner will show "Pending local approval"
    navigate(`/dashboard?booking=${booking.id}`);
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-lg shadow-black/5">
      <div className="flex items-end justify-between">
        <div className="text-2xl font-extrabold text-neutral-900">
          {currency}
          {price}
          <span className="ml-1 text-sm font-normal text-neutral-500">/person</span>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-neutral-50 px-2.5 py-1 text-sm text-neutral-700">
          <span className="text-amber-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="m12 17.27 6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </span>
          {rating?.value?.toFixed(1) ?? "4.8"}{" "}
          <span className="text-neutral-500">({rating?.count ?? 42})</span>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-600">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-orange-400/40"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-600">Guests</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              className="h-10 w-10 rounded-xl border border-neutral-200 text-lg font-bold text-neutral-700 hover:bg-neutral-50"
              aria-label="Decrease guests"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={maxGroup}
              value={guests}
              onChange={(e) =>
                setGuests(Math.min(maxGroup || 99, Math.max(1, Number(e.target.value) || 1)))
              }
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-center text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-orange-400/40"
            />
            <button
              type="button"
              onClick={() => setGuests((g) => Math.min(maxGroup || 99, g + 1))}
              className="h-10 w-10 rounded-xl border border-neutral-200 text-lg font-bold text-neutral-700 hover:bg-neutral-50"
              aria-label="Increase guests"
            >
              +
            </button>
          </div>
          {maxGroup && <p className="mt-1 text-xs text-neutral-500">Max {maxGroup} guests</p>}
        </div>
      </div>

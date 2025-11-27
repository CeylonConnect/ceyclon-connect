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

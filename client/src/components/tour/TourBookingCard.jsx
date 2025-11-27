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

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

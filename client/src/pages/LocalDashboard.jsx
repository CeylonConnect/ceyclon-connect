import React, { useEffect, useMemo, useState } from "react";
import TopbarLocal from "../components/local/TopbarLocal";
import SummaryStat from "../components/local/SummaryStat";
import Tabs from "../components/admin/Tabs";
import MyToursPanel from "../components/local/MyTourPanel";
import BookingsPanel from "../components/local/BookingPanel";
import ReviewsPanel from "../components/local/ReviewPanel";
import BadgeRequestCard from "../components/local/BadgeRequestCard";
import { getBookingsByProvider } from "../api1/booking";
import { getToursByProvider } from "../api1/tours";
import { getGuideAverageRating } from "../api1/reviews";
import { normalizeList } from "../api1/client";

// Replace with real auth integration
function useAuthFallback() {
  const [user] = useState({
    id: "guide_1",
    firstName: "Sarah",
    lastName: "Perera",
    name: "Sarah",
  });
  return { user };
}

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

export default function LocalDashboard() {
  const { user } = useAuthFallback();
  const providerId = user?.id || "";

  const [stats, setStats] = useState({
    totalTours: 0,
    totalBookings: 0,
    earnings: 0,
    rating: 0,
  });

  const [tab, setTab] = useState("tours");

  const loadStats = async () => {
    try {
      const [tours, bookings, rating] = await Promise.all([
        getToursByProvider(providerId).catch(() => []),
        getBookingsByProvider(providerId).catch(() => []),
        getGuideAverageRating(providerId).catch(() => ({ average: 0 })),
      ]);
      const tourList = normalizeList(tours);
      const bookingList = normalizeList(bookings);

      const earnings = bookingList
        .filter((b) => ["approved", "completed"].includes(b.status))
        .reduce((sum, b) => sum + Number(b.total || b.tour?.price || 0), 0);

      setStats({
        totalTours: tourList.length,
        totalBookings: bookingList.length,
        earnings,
        rating: Number(rating?.average || rating?.avg || rating?.value || 0),
      });
    } catch (e) {
      // silent fail; panels show errors
    }
  };

 useEffect(() => {
    if (providerId) loadStats();
  }, [providerId]);

  const tabs = useMemo(
    () => [
      { value: "tours", label: "My Tours" },
      { value: "bookings", label: "Bookings" },
      { value: "reviews", label: "Reviews" },
    ],
    []
  );

   return (
    <main className="min-h-screen bg-sand-50">
      <TopbarLocal name={user?.firstName} cl/>

      <div className="mx-auto mt-8 max-w-7xl px-4 ">
        <div className="grid gap-4 md:grid-cols-4">
          <SummaryStat label="Total Tours" value={stats.totalTours} sub="Active packages" icon={<span>📅</span>} />
          <SummaryStat label="Total Bookings" value={stats.totalBookings} sub="This month" icon={<span>💬</span>} />
          <SummaryStat label="Earnings" value={`$${stats.earnings}`} sub="Total revenue" icon={<span>💲</span>} />
          <SummaryStat label="Rating" value={stats.rating.toFixed(1)} sub="Average rating" icon={<span>⭐</span>} />
        </div>
      </div>

      <section className="mx-auto mt-6 max-w-7xl px-4">
        <Tabs value={tab} onChange={setTab} items={tabs} />

        <BadgeRequestCard userId={providerId} />

        {tab === "tours" && <MyToursPanel providerId={providerId} />}
        {tab === "bookings" && <BookingsPanel providerId={providerId} />}
        {tab === "reviews" && <ReviewsPanel guideId={providerId} />}
      </section>
    </main>
  );
}

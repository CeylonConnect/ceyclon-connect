import React, { useEffect, useState } from "react";
import { getBookingStats, getPlatformStats } from "../../api/admin";
import SummaryStat from "./SummaryStat";

export default function StatsHeader() {
  const [stats, setStats] = useState(null);
  const [timeframe, setTimeframe] = useState("month");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const s = await getPlatformStats();
      // optional: daily booking stats if you want to chart; not shown, but fetched
      await getBookingStats(timeframe);
      setStats(s);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeframe]);

  return (
    <div className="mx-auto -mt-8 max-w-7xl px-4">
      <div className="mb-3 flex items-center justify-between">
        <div />
        <div className="flex items-center gap-2">
          <label className="text-xs text-white/90">Timeframe</label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="rounded-lg border border-white/40 bg-white/20 px-2 py-1 text-xs text-white backdrop-blur ring-1 ring-white/30"
          >
            <option value="week">Past week</option>
            <option value="month">Past month</option>
            <option value="year">Past year</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryStat
          label="Total Users"
          value={loading ? "—" : stats?.totalUsers ?? 0}
          sub={
            loading
              ? ""
              : `${stats?.tourists ?? 0} tourists, ${stats?.locals ?? 0} locals`
          }
          icon={<span>👥</span>}
        />
        <SummaryStat
          label="Total Tours"
          value={loading ? "—" : stats?.totalTours ?? 0}
          icon={<span>📍</span>}
        />
        <SummaryStat
          label="Total Bookings"
          value={loading ? "—" : stats?.totalBookings ?? 0}
          sub={`${stats?.totalReviews ?? 0} reviews`}
          icon={<span>📅</span>}
        />
        <SummaryStat
          label="Revenue"
          value={loading ? "—" : `Rs. ${stats?.revenue ?? 0}`}
          sub="Total platform revenue"
          icon={<span>💲</span>}
        />
      </div>
    </div>
  );
}

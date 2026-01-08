import React, { useEffect, useState } from "react";
import { getPopularTours } from "../../api/admin";
import Reveal from "../motion/Reveal";

export default function ToursPanel() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getPopularTours(12);
      setTours(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load tours (admin)", e);
      const message =
        (typeof e?.message === "string" && e.message) ||
        (typeof e === "string" && e) ||
        "Failed to load tours";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white">
          Tours
        </h3>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-500 dark:border-neutral-800 dark:bg-black dark:text-neutral-300">
          Loading...
        </div>
      ) : tours.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-500 dark:border-neutral-800 dark:bg-black dark:text-neutral-300">
          No tours.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {tours.map((t, idx) => (
            <Reveal key={idx}>
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-black">
                <div className="text-base font-semibold text-neutral-900 dark:text-white">
                  {t.title || t.name}
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-300">
                  Bookings:{" "}
                  <span className="font-semibold">
                    {t.bookings || t.count || t.booking_count || 0}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

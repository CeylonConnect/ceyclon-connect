import React, { useEffect, useState } from "react";
import { getGuideAverageRating, getReviewsByGuide } from "../../api1/reviews";
import Reveal from "../motion/Reveal2";

function Stars({ value = 0 }) {
  const v = Math.round(value);
  return (
    <div className="flex items-center gap-1 text-amber-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < v ? "currentColor" : "none"}
          stroke="currentColor"
        >
          <path d="m12 17.27 6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsPanel({ guideId }) {
  const [list, setList] = useState([]);
  const [avg, setAvg] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const r = await getReviewsByGuide(guideId);
      setList(Array.isArray(r) ? r : []);
      const a = await getGuideAverageRating(guideId);
      setAvg(Number(a?.average || a?.avg || a?.value || 0));
    } catch (e) {
      setList([]);
      setAvg(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (guideId) load();
  }, [guideId]);

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-neutral-900">Reviews</h3>
        <div className="flex items-center gap-2 text-sm text-neutral-700">
          <Stars value={avg} />
            <span className="font-semibold">{avg.toFixed(1)}</span>
          <span className="text-neutral-400">avg rating</span>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-500">Loading...</div>
      ) : list.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-500">
          No reviews yet.
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((rv) => (
            <Reveal key={rv._id || rv.id}>
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-neutral-900">
                    {rv.author?.name || rv.user?.name || "Traveler"}
                  </div>
                  <Stars value={Number(rv.rating || 0)} />
                </div>
                <p className="mt-2 text-[15px] text-neutral-700">
                  {rv.text || rv.comment || "-"}
                </p>
                <div className="mt-1 text-xs text-neutral-500">
                  {rv.createdAt ? new Date(rv.createdAt).toLocaleDateString() : ""}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
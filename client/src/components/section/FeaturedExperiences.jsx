import React, { useMemo, useState } from "react";
import { EXPERIENCES_MOCK } from "../../data/experiences.mock";

const cx = (...c) => c.filter(Boolean).join(" ");

function RatingBadge({ value, count }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-neutral-800 shadow">
      <span className="text-amber-500">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="m12 17.27 6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      </span>
      {value.toFixed(1)} <span className="text-neutral-500 text-xs">({count})</span>
    </div>
  );
}


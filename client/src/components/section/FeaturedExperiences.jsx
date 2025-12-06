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

function CategoryChip({ label }) {
  return (
    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-neutral-700 shadow">
      {label}
    </span>
  );
}
function Meta({ icon, children }) {
  return (
    <div className="inline-flex items-center gap-1.5 text-sm text-neutral-600">
      <span className="text-neutral-500">{icon}</span>
      {children}
    </div>
  );
}

function ExperienceCard({ item }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative h-56 w-full overflow-hidden">
        <img src={item.image} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        <div className="absolute left-4 bottom-4">
          <RatingBadge value={item.rating.value} count={item.rating.count} />
        </div>
        <div className="absolute right-4 top-4">
          <CategoryChip label={item.category} />
        </div>
      </div>


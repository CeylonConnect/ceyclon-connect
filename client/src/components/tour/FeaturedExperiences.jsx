
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

      <div className="p-5 sm:p-6">
        <h3 className="text-xl font-semibold text-neutral-800">{item.title}</h3>
        <p
          className="mt-2 text-[15px] text-neutral-600"
          style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {item.excerpt}
        </p>

        <div className="mt-4 flex items-center gap-3">
          <img src={item.guide.avatar} alt={item.guide.name} className="h-9 w-9 rounded-full object-cover" loading="lazy" />
          <div className="text-sm font-medium text-neutral-800 flex items-center gap-1">
            {item.guide.name}
            {item.guide.verified && (
              <span className="text-amber-500" title="Verified guide" aria-label="Verified guide">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2 3 8v8l9 6 9-6V8l-9-6Zm-1 13-3-3 1.4-1.4L11 12.2l4.6-4.6L17 9l-6 6Z" />
                </svg>
              </span>
            )}
          </div>
        </div>
<div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
          <Meta icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-6.5 8-13A8 8 0 1 0 4 9c0 6.5 8 13 8 13Z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="2"/></svg>}>
            {item.location}
          </Meta>
          <Meta icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}>
            {item.durationHours}h
          </Meta>
          <Meta icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M16 11a4 4 0 1 0-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M3 20a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}>
            Up to {item.groupSize}
          </Meta>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="text-xl font-bold text-orange-600">
            {item.currency}{item.price}
            <span className="ml-1 text-sm font-normal text-neutral-500">/person</span>
          </div>
          <a href={`/tours/${item.slug}`} className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 active:scale-95">
            View Details
          </a>
        </div>
      </div>
    </article>
  );
}

function Pagination({ total, perPage, page, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (totalPages <= 1) return null;

  const go = (p) => onChange(Math.min(Math.max(1, p), totalPages));
  const pages = [];
  const windowSize = 1;
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || (p >= page - windowSize && p <= page + windowSize)) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }


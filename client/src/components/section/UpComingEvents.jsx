import React, { useEffect, useMemo, useState } from "react";
import { EVENTS_MOCK } from "../../data/event.mock";

// Format date (adjust locale or library as needed)
function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function EventCard({ event }) {
  const hasImage = Boolean(event.image);

  return (
    <article className="flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-md transition">
      {/* Media panel */}
      <div className="h-44 w-full sm:h-auto sm:w-72 shrink-0 relative bg-black">
        {hasImage ? (
          <>
            <img
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-100">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/70 shadow">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#666" strokeWidth="2" />
                <path
                  d="M12 7v5l3 2"
                  stroke="#666"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

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

 {/* Body */}
      <div className="flex-1 p-6">
        <h3 className="text-xl font-semibold text-neutral-800">
          {event.title}
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
          {event.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-neutral-700">
          <div className="flex items-center gap-1.5">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="text-neutral-500"
            >
              <path
                d="M12 22s8-6.5 8-13A8 8 0 1 0 4 9c0 6.5 8 13 8 13Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                cx="12"
                cy="9"
                r="3"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            {event.location}
          </div>
          <div className="flex items-center gap-1.5">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="text-neutral-500"
            >
              <rect
                x="3"
                y="4"
                width="18"
                height="17"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M8 2v4M16 2v4M3 10h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            {formatDate(event.startDate)}
            {event.endDate && ` – ${formatDate(event.endDate)}`}
          </div>
          {event.type && (
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
              {event.type}
            </span>
          )}
        </div>

        <div className="mt-5">
          <a
            href={`/events/${event.slug}`}
            className="inline-flex rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-105 active:scale-95 transition"
          >
            View Details
          </a>
        </div>
      </div>
    </article>
  );
}

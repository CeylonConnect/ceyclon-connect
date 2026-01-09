import React from "react";

function Chip({ color = "neutral", children }) {
  const map = {
    green:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200",
    amber:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200",
    neutral:
      "bg-neutral-100 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200",
    rose: "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200",
    teal: "bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-200",
  };
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${map[color]}`}
    >
      {children}
    </span>
  );
}

export default function BookingItem({ booking, onMessage }) {
  const status = String(booking.status || "pending").toLowerCase();
  const statusUi =
    status === "confirmed"
      ? { label: "confirmed", color: "green" }
      : status === "completed"
      ? { label: "completed", color: "teal" }
      : status === "cancelled"
      ? { label: "cancelled", color: "rose" }
      : { label: "pending approval", color: "amber" };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm md:flex-row md:items-center dark:border-neutral-800 dark:bg-black">
      <img
        src={booking.tour.image}
        alt={booking.tour.title}
        className="h-28 w-40 rounded-xl object-cover"
      />

      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">
            {booking.tour.title}
          </h3>
          <Chip color={statusUi.color}>{statusUi.label}</Chip>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-700 dark:text-neutral-300">
          <div className="inline-flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
            {booking.tour.location}
          </div>
          <div className="inline-flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
            {booking.date}
          </div>
          <div className="inline-flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M16 11a4 4 0 1 0-8 0"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M3 20a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            {booking.guests} {booking.guests > 1 ? "people" : "person"}
          </div>
          <div className="inline-flex items-center gap-2">
            <span className="font-semibold text-neutral-900">
              {booking.tour.currency}
              {booking.total}
            </span>
          </div>
        </div>

        <div className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
          Guide:{" "}
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            {booking.guide.name}
          </span>{" "}
          {booking.guide.verified && (
            <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-200">
              Verified
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onMessage(booking)}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 12a7 7 0 0 1-7 7H7l-4 3V12a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            Contact Guide
          </button>
          <a
            href={`/tours/${booking.tour.slug}`}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  );
}

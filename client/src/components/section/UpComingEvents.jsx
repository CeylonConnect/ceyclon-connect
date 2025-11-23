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

function Pagination({ total, perPage, page, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (totalPages <= 1) return null;
  const go = (p) => onChange(Math.min(Math.max(1, p), totalPages));
  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <button
        onClick={() => go(page - 1)}
        disabled={page === 1}
        className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
          page === 1
            ? "cursor-not-allowed border-neutral-200 text-neutral-400"
            : "border-neutral-200 text-neutral-700 hover:bg-neutral-50"
        }`}
      >
        Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => go(p)}
          className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold ${
            p === page
              ? "bg-neutral-900 text-white"
              : "text-neutral-700 hover:bg-neutral-100"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => go(page + 1)}
        disabled={page === totalPages}
        className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
          page === totalPages
            ? "cursor-not-allowed border-neutral-200 text-neutral-400"
            : "border-neutral-200 text-neutral-700 hover:bg-neutral-50"
        }`}
      >
        Next
      </button>
    </div>
  );
}

export default function UpcomingEvents({
  items = EVENTS_MOCK,
  showPagination = true,
  itemsPerPage = 2,
  limit = 2,
  showFilters, // optional override
}) {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ query: "", district: "" });

  // default behavior: show filters on full events page, hide on home widgets
  const shouldShowFilters =
    typeof showFilters === "boolean" ? showFilters : showPagination;

  // derive district options from data
  const districts = useMemo(
    () =>
      Array.from(new Set(items.map((e) => e.location).filter(Boolean))).sort(),
    [items]
  );

  // apply filters
  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return items
      .filter((e) =>
        q
          ? e.title.toLowerCase().includes(q) ||
            (e.description || "").toLowerCase().includes(q)
          : true
      )
      .filter((e) => (filters.district ? e.location === filters.district : true));
  }, [items, filters]);

  // reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters.query, filters.district]);

  // paginate or limit
  const visible = useMemo(() => {
    if (!showPagination) return filtered.slice(0, limit);
    const start = (page - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, page, itemsPerPage, showPagination, limit]);

 return (
    <section id="events" className="bg-sand-50">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-800">
              Upcoming Events
            </h2>
            <p className="mt-1 text-neutral-600">
              Don't miss these cultural celebrations
            </p>
          </div>
          <a
            href="/events"
            className={`hidden sm:inline-flex rounded-xl border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 ${
              showPagination ? "invisible pointer-events-none" : ""
            }`}
            aria-hidden={showPagination}
          >
            View All Events
          </a>
        </div>

        {/* Filters */}
        {shouldShowFilters && (
          <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Search by name */}
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-medium text-neutral-600">
                  Search by name
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm shadow-sm focus-within:ring-2 focus-within:ring-orange-400/40">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-neutral-500"
                  >
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                    <path
                      d="M21 21l-3.4-3.4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <input
                    value={filters.query}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, query: e.target.value }))
                    }
                    placeholder="Search events (e.g., Perahera, Literary)"
                    className="w-full bg-transparent text-neutral-800 placeholder:text-neutral-500 outline-none"
                  />
                </div>
              </div>

              {/* District */}
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-600">
                  District
                </label>
                <select
                  value={filters.district}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, district: e.target.value }))
                  }
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-orange-400/40"
                >
                  <option value="">All districts</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setFilters({ query: "", district: "" })}
                className="rounded-xl border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {visible.map((ev) => (
            <EventCard key={ev.id} event={ev} />
          ))}
          {visible.length === 0 && (
            <div className="col-span-full rounded-2xl border border-neutral-200 bg-white p-10 text-center text-neutral-600">
              No events found. Try a different name or district.
            </div>
          )}
        </div>

        {showPagination && (
          <Pagination
            total={filtered.length}
            perPage={itemsPerPage}
            page={page}
            onChange={setPage}
          />
        )}
      </div>
    </section>
  );
}

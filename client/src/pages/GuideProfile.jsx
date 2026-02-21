import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getUserById } from "../api1/users";
import { getToursByProvider } from "../api1/tours";
import { getReviewsByGuide, getGuideAverageRating } from "../api1/reviews";

const FALLBACK_AVATAR = "https://via.placeholder.com/96?text=Guide";

function StarRating({ value = 0 }) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = i + 1 <= rounded ? "currentColor" : "none";
        return (
          <svg
            key={i}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={fill}
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.1 6.5L12 17l-5.8 3.1 1.1-6.5-4.8-4.6 6.6-.9z"
            />
          </svg>
        );
      })}
    </span>
  );
}

function TourCard({ tour }) {
  return (
    <Link
      to={`/tours/${tour.slug ?? tour.id}`}
      className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 hover:shadow-md transition-shadow"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={tour.image}
          alt={tour.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-neutral-700 dark:bg-neutral-900/90 dark:text-neutral-300">
          {tour.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-neutral-800 dark:text-white line-clamp-1">
          {tour.title}
        </h3>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
          {tour.excerpt}
        </p>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">
            {tour.durationHours}h · up to {tour.groupSize}
          </span>
          <span className="font-semibold text-orange-600">
            {tour.currency}
            {Number(tour.price).toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function GuideProfile() {
  const { id } = useParams();

  const [guide, setGuide] = useState(null);
  const [tours, setTours] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState({ average: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    setError("");

    (async () => {
      try {
        const [user, tourList, reviewList, avgRating] =
          await Promise.allSettled([
            getUserById(id),
            getToursByProvider(id),
            getReviewsByGuide(id),
            getGuideAverageRating(id),
          ]);

        if (!mounted) return;

        if (user.status === "fulfilled") {
          setGuide(user.value);
        } else {
          setError("Guide not found.");
        }

        if (tourList.status === "fulfilled") {
          setTours(Array.isArray(tourList.value) ? tourList.value : []);
        }

        if (reviewList.status === "fulfilled") {
          setReviews(Array.isArray(reviewList.value) ? reviewList.value : []);
        }

        if (avgRating.status === "fulfilled") {
          setRatingStats({
            average: Number(avgRating.value?.average ?? 0),
            total: Number(avgRating.value?.total ?? 0),
          });
        }
      } catch (e) {
        if (mounted) setError("Failed to load guide profile.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-white dark:bg-black">
          <div className="mx-auto max-w-4xl px-4 py-24 text-center">
            <p className="text-neutral-600 dark:text-neutral-300">
              Loading guide profile…
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !guide) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-white dark:bg-black">
          <div className="mx-auto max-w-4xl px-4 py-24 text-center">
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">
              Guide not found
            </h1>
            <p className="mt-2 text-neutral-600 dark:text-neutral-300">
              {error || "This guide profile doesn't exist or was removed."}
            </p>
            <Link
              to="/tours"
              className="mt-6 inline-flex rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Browse tours
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const fullName =
    `${guide.first_name ?? ""} ${guide.last_name ?? ""}`.trim() ||
    "Local Guide";
  const avatar = guide.profile_picture || FALLBACK_AVATAR;
  const isVerified =
    String(guide.badge_status ?? "").toLowerCase() === "verified";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-black">
        {/* Breadcrumbs */}
        <nav
          className="mx-auto max-w-4xl px-4 py-4 text-sm"
          aria-label="Breadcrumb"
        >
          <ol className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
            <li>
              <Link
                className="hover:text-neutral-800 dark:hover:text-neutral-200"
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="text-neutral-400">/</li>
            <li>
              <Link
                className="hover:text-neutral-800 dark:hover:text-neutral-200"
                to="/tours"
              >
                Tours
              </Link>
            </li>
            <li className="text-neutral-400">/</li>
            <li className="text-neutral-700 dark:text-neutral-200">
              {fullName}
            </li>
          </ol>
        </nav>

        {/* Profile header */}
        <section className="mx-auto max-w-4xl px-4 pb-10">
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-950 sm:flex-row sm:text-left">
            <img
              src={avatar}
              alt={fullName}
              className="h-24 w-24 rounded-full object-cover ring-4 ring-white dark:ring-neutral-900 shrink-0"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-2xl font-extrabold text-neutral-800 dark:text-white">
                  {fullName}
                </h1>
                {isVerified && (
                  <span
                    title="Verified guide"
                    className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2 3 8v8l9 6 9-6V8l-9-6Zm-1 13-3-3 1.4-1.4L11 12.2l4.6-4.6L17 9l-6 6Z" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm capitalize text-neutral-500 dark:text-neutral-400">
                {guide.role === "local" || guide.role === "guide"
                  ? "Local Guide"
                  : guide.role}
              </p>

              {ratingStats.total > 0 && (
                <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
                  <StarRating value={ratingStats.average} />
                  <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                    {ratingStats.average.toFixed(1)}
                  </span>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    ({ratingStats.total}{" "}
                    {ratingStats.total === 1 ? "review" : "reviews"})
                  </span>
                </div>
              )}

              {tours.length > 0 && (
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  {tours.length} {tours.length === 1 ? "tour" : "tours"}{" "}
                  available
                </p>
              )}
            </div>
          </div>

          {/* Tours */}
          {tours.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-neutral-800 dark:text-white">
                Tours by {fullName}
              </h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tours.map((tour) => {
                  const id = tour.tour_id ?? tour.id;
                  const slug = tour.slug ?? String(id);
                  return (
                    <TourCard
                      key={id}
                      tour={{
                        id,
                        slug,
                        title: tour.title || "Untitled tour",
                        excerpt: tour.excerpt || tour.description || "",
                        image:
                          tour.image ||
                          (Array.isArray(tour.images)
                            ? tour.images[0]
                            : undefined) ||
                          "https://via.placeholder.com/400x300?text=Tour",
                        category: tour.category || "cultural",
                        durationHours:
                          tour.duration_hours ?? tour.durationHours ?? 0,
                        groupSize: tour.max_group_size ?? tour.groupSize ?? 10,
                        price: Number(tour.price ?? 0),
                        currency: tour.currency || "Rs. ",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-neutral-800 dark:text-white">
                Traveler Reviews
              </h2>
              <div className="mt-4 space-y-4">
                {reviews.map((r) => {
                  const reviewer =
                    `${r.first_name ?? ""} ${r.last_name ?? ""}`.trim() ||
                    "Traveler";
                  const date = r.created_at
                    ? new Date(r.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "";
                  return (
                    <div
                      key={r.review_id ?? r.id}
                      className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-neutral-800 dark:text-white">
                              {reviewer}
                            </span>
                            <StarRating value={Number(r.rating ?? 0)} />
                          </div>
                          {date && (
                            <p className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-500">
                              {date}
                            </p>
                          )}
                        </div>
                      </div>
                      {r.comment && (
                        <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
                          {r.comment}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tours.length === 0 && reviews.length === 0 && (
            <div className="mt-10 rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center dark:border-neutral-800 dark:bg-neutral-950">
              <p className="text-neutral-500 dark:text-neutral-400">
                This guide hasn't listed any tours yet.
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}


import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom"; // ensure react-router-dom is installed and configured
import Navbar from "../components/Navbar";
import FeaturedExperiences from "../components/section/FeaturedExperiences";
import { EXPERIENCES_MOCK } from "../data/experiences.mock";
import TourBookingCard from "../components/tour/TourBookingCard";
import FAQAccordion from "../components/tour/FAQ";
import ReviewCard from "../components/tour/ReviewCard";
import Footer from "../components/Footer";
import { getTourById, toExperienceItem } from "../api1/tours";
import {
  createReview,
  getAverageRating,
  getReviewsByTour,
} from "../api1/reviews";
import { useAuth } from "../state/AuthContext";

function Breadcrumbs({ title }) {
  return (
    <nav
      className="mx-auto max-w-6xl px-4 py-4 text-sm"
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
        <li className="text-neutral-400 dark:text-neutral-700">/</li>
        <li>
          <Link
            className="hover:text-neutral-800 dark:hover:text-neutral-200"
            to="/tours"
          >
            Tours
          </Link>
        </li>
        <li className="text-neutral-400 dark:text-neutral-700">/</li>
        <li
          className="text-neutral-700 line-clamp-1 dark:text-neutral-200"
          title={title}
        >
          {title}
        </li>
      </ol>
    </nav>
  );
}

function Hero({ item }) {
  return (
    <section className="relative isolate">
      <div className="absolute inset-0 -z-10">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 -z-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      <div className="mx-auto max-w-6xl px-4 pt-24 pb-14 text-white">
        <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
          {item.category}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl md:text-5xl drop-shadow">
          {item.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/90">
          <div className="inline-flex items-center gap-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-amber-400"
            >
              <path d="m12 17.27 6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span className="font-semibold">
              {item.rating.value.toFixed(1)}
            </span>
            <span className="text-white/80">({item.rating.count} reviews)</span>
          </div>
          <span className="opacity-50">•</span>
          <div className="inline-flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
            {item.location}
          </div>
          <span className="opacity-50">•</span>
          <div className="inline-flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M12 7v5l3 2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            {item.durationHours}h
          </div>
          <span className="opacity-50">•</span>
          <div className="inline-flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
            Up to {item.groupSize}
          </div>
        </div>
      </div>
    </section>
  );
}

function Gallery({ main, extras }) {
  const [active, setActive] = useState(main);
  const images = useMemo(
    () => [main, ...extras].filter(Boolean),
    [main, extras]
  );
  return (
    <section className="mx-auto max-w-6xl px-4 -mt-10 relative">
      <div className="rounded-2xl overflow-hidden ring-1 ring-black/5 shadow-lg bg-white dark:bg-black dark:ring-white/10">
        <div className="grid gap-2 p-2 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <img
              src={active}
              alt="Gallery main"
              className="h-80 w-full rounded-xl object-cover sm:h-[28rem]"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
            {images.slice(1, 5).map((src, idx) => (
              <button
                key={idx}
                className={`relative overflow-hidden rounded-xl ring-1 ring-black/5 transition ${
                  active === src
                    ? "outline outline-2 outline-orange-400"
                    : "hover:opacity-90"
                }`}
                onClick={() => setActive(src)}
                aria-label={`Select image ${idx + 1}`}
              >
                <img
                  src={src}
                  alt={`Gallery ${idx + 1}`}
                  className="h-36 w-full object-cover sm:h-[6.75rem]"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Section({ title, children }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-white">
        {title}
      </h2>
      <div className="mt-4 text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">
        {children}
      </div>
    </section>
  );
}

function GuideCard({ guide }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-black">
      <img
        src={guide.avatar}
        alt={guide.name}
        className="h-14 w-14 rounded-full object-cover"
      />
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-neutral-800 dark:text-white">
            {guide.name}
          </h4>
          {guide.verified && (
            <span className="text-amber-500" title="Verified">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2 3 8v8l9 6 9-6V8l-9-6Zm-1 13-3-3 1.4-1.4L11 12.2l4.6-4.6L17 9l-6 6Z" />
              </svg>
            </span>
          )}
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Local guide • 5+ years experience
        </p>
      </div>
      <div className="ml-auto">
        <Link
          to="/guides"
          className="text-sm font-semibold text-orange-600 hover:underline"
        >
          View profile
        </Link>
      </div>
    </div>
  );
}

export default function TourDetails() {
  const { slug } = useParams(); // expects route: /tours/:slug
  const { user } = useAuth();
  const mockItem = useMemo(
    () => EXPERIENCES_MOCK.find((i) => i.slug === slug),
    [slug]
  );
  const [item, setItem] = useState(mockItem || null);
  const [backendTour, setBackendTour] = useState(null);
  const [loading, setLoading] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState({ average: 0, total: 0 });
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const activeTourId = useMemo(() => {
    const id = backendTour?.tour_id ?? backendTour?.id;
    if (id) return Number(id);
    if (/^\d+$/.test(String(slug || ""))) return Number(slug);
    return null;
  }, [backendTour, slug]);

  useEffect(() => {
    // If it exists in mock data, keep current behavior.
    if (mockItem) {
      setItem(mockItem);
      setBackendTour(null);
      setLoading(false);
      return;
    }

    // DB tours don’t have a slug column; we route by numeric id.
    const isNumericId = /^\d+$/.test(String(slug || ""));
    if (!isNumericId) {
      setItem(null);
      setBackendTour(null);
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const tour = await getTourById(slug);
        if (!mounted) return;
        setBackendTour(tour);
        setItem(toExperienceItem(tour));
      } catch (e) {
        console.error("Failed to load tour details", e);
        if (!mounted) return;
        setBackendTour(null);
        setItem(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [slug, mockItem]);

  useEffect(() => {
    if (!activeTourId) return;
    let mounted = true;
    setReviewsLoading(true);
    setReviewError("");
    (async () => {
      try {
        const [list, avg] = await Promise.all([
          getReviewsByTour(activeTourId),
          getAverageRating(activeTourId),
        ]);
        if (!mounted) return;
        setReviews(Array.isArray(list) ? list : []);
        setRatingStats({
          average: Number(avg?.average ?? avg?.average_rating ?? 0),
          total: Number(avg?.total ?? avg?.total_reviews ?? 0),
        });
      } catch (e) {
        if (!mounted) return;
        setReviews([]);
        setRatingStats({ average: 0, total: 0 });
      } finally {
        if (mounted) setReviewsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [activeTourId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="bg-white dark:bg-black">
          <div className="mx-auto max-w-3xl px-4 py-24 text-center">
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">
              Loading tour...
            </h1>
            <p className="mt-2 text-neutral-600 dark:text-neutral-300">
              Please wait a moment.
            </p>
          </div>
        </main>
      </>
    );
  }

  if (!item) {
    return (
      <>
        <Navbar />
        <main className="bg-white dark:bg-black">
          <div className="mx-auto max-w-3xl px-4 py-24 text-center">
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">
              Tour not found
            </h1>
            <p className="mt-2 text-neutral-600 dark:text-neutral-300">
              The experience you’re looking for doesn’t exist or was removed.
            </p>
            <Link
              to="/tours"
              className="mt-6 inline-flex rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Back to all tours
            </Link>
          </div>
        </main>
      </>
    );
  }

  // Build a small gallery if the mock lacks one
  const gallery = (() => {
    const imgs = Array.isArray(backendTour?.images) ? backendTour.images : [];
    if (imgs.length > 0) return imgs;
    return [
      item.image,
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590069261209-8b83e1b82588?q=80&w=1400&auto=format&fit=crop",
    ];
  })();

  // Mock itinerary / includes / FAQs / Reviews (replace with backend later)
  const includes = [
    "Hotel pickup and drop-off",
    "Bottled water",
    "Licensed local guide",
    "Entrance tickets",
  ];
  const notIncluded = ["Meals", "Personal expenses", "Gratuities"];
  const itinerary = [
    { time: "08:00", text: "Pickup from your hotel and briefing" },
    { time: "09:30", text: "Scenic drive and photo stops" },
    { time: "11:00", text: "Main site tour with guide commentary" },
    { time: "13:00", text: "Optional hike / activity segment" },
    { time: "16:00", text: "Return transfer to your hotel" },
  ];
  const faqs = [
    {
      q: "Is this tour suitable for children?",
      a: "Yes, families are welcome. Please inform us of any special requirements.",
    },
    {
      q: "What should I bring?",
      a: "Comfortable shoes, sunscreen, hat, and a reusable water bottle.",
    },
    {
      q: "Can I customize the itinerary?",
      a: "Absolutely. Message the guide after booking to tailor the day.",
    },
  ];
  const mockReviews = [
    {
      id: 1,
      author: "Emily W.",
      avatar: "https://i.pravatar.cc/96?img=12",
      rating: 5,
      date: "2025-08-03",
      text: "Incredible experience. The guide was knowledgeable and super friendly. Highly recommended!",
    },
    {
      id: 2,
      author: "Jonas R.",
      avatar: "https://i.pravatar.cc/96?img=30",
      rating: 4,
      date: "2025-06-21",
      text: "Great route and views. Would love a bit more time at the main site, otherwise perfect.",
    },
  ];

  const canReview =
    Boolean(activeTourId) &&
    Boolean(user) &&
    (user?.role || "").toLowerCase() === "tourist";

  const onSubmitReview = async (e) => {
    e?.preventDefault?.();
    if (!activeTourId) return;
    setSubmittingReview(true);
    setReviewError("");
    try {
      await createReview({
        tour_id: activeTourId,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewComment("");
      setReviewRating(5);
      // Refresh reviews + average
      const [list, avg] = await Promise.all([
        getReviewsByTour(activeTourId),
        getAverageRating(activeTourId),
      ]);
      setReviews(Array.isArray(list) ? list : []);
      setRatingStats({
        average: Number(avg?.average ?? avg?.average_rating ?? 0),
        total: Number(avg?.total ?? avg?.total_reviews ?? 0),
      });
    } catch (err) {
      setReviewError(err?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const displayedReviews = activeTourId ? reviews : mockReviews;
  const displayedRating = activeTourId
    ? {
        value: Number(ratingStats.average || 0),
        count: Number(ratingStats.total || 0),
      }
    : item.rating;

  // Related tours (same category, excluding current)
  const related = EXPERIENCES_MOCK.filter(
    (x) => x.category === item.category && x.id !== item.id
  );

  return (
    <>
      <Navbar
        isAuthenticated={true}
        onLoginClick={() => (window.location.href = "/login")}
        onSignupClick={() => (window.location.href = "/signup")}
        onDashboardClick={() => (window.location.href = "/dashboard")}
      />
      <main className="bg-white dark:bg-black">
        <Breadcrumbs title={item.title} />
        <Hero item={{ ...item, rating: displayedRating }} />
        <Gallery main={gallery[0]} extras={gallery.slice(1)} />

        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_370px]">
            {/* Left column */}
            <div className="space-y-8">
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-black">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-white">
                  Overview
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {item.excerpt}
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-950">
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      Duration
                    </div>
                    <div className="mt-1 font-semibold text-neutral-800 dark:text-white">
                      {item.durationHours} hours
                    </div>
                  </div>
                  <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-950">
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      Group size
                    </div>
                    <div className="mt-1 font-semibold text-neutral-800 dark:text-white">
                      Up to {item.groupSize} people
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-black">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-white">
                  Itinerary
                </h2>
                <ol className="mt-4 space-y-4">
                  {itinerary.map((row, idx) => (
                    <li key={idx} className="flex gap-4">
                      <div className="mt-1 w-16 shrink-0 text-sm font-semibold text-orange-600">
                        {row.time}
                      </div>
                      <div className="flex-1 text-[15px] text-neutral-700 dark:text-neutral-300">
                        {row.text}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-black">
                  <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">
                    What’s included
                  </h3>
                  <ul className="mt-3 space-y-2 text-[15px] text-neutral-700 dark:text-neutral-300">
                    {includes.map((v, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-emerald-500">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
                          </svg>
                        </span>
                        {v}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-black">
                  <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">
                    Not included
                  </h3>
                  <ul className="mt-3 space-y-2 text-[15px] text-neutral-700 dark:text-neutral-300">
                    {notIncluded.map((v, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-rose-500">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M18.3 5.7 5.7 18.3l1.4 1.4L19.7 7.1l-1.4-1.4Zm0 12.6L7.1 7.1 5.7 5.7 18.3 18.3l1.4-1.4Z" />
                          </svg>
                        </span>
                        {v}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <GuideCard guide={item.guide} />

              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-black">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-white">
                  FAQs
                </h2>
                <FAQAccordion items={faqs} />
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-black">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-white">
                  Traveler reviews
                </h2>

                {activeTourId && reviewsLoading ? (
                  <div className="mt-4 rounded-xl bg-neutral-50 p-4 text-sm text-neutral-600 dark:bg-neutral-950 dark:text-neutral-300">
                    Loading reviews...
                  </div>
                ) : null}

                {canReview && (
                  <form
                    onSubmit={onSubmitReview}
                    className="mt-4 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-black"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-neutral-800 dark:text-white">
                        Leave a review
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const v = i + 1;
                          return (
                            <button
                              key={v}
                              type="button"
                              onClick={() => setReviewRating(v)}
                              className="p-0.5"
                              aria-label={`Rate ${v} star`}
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill={
                                  v <= reviewRating ? "currentColor" : "none"
                                }
                                stroke="currentColor"
                              >
                                <path d="m12 17.27 6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={3}
                      className="mt-3 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-orange-400/40 dark:border-neutral-800 dark:bg-black dark:text-neutral-200"
                      placeholder="Share your experience..."
                    />

                    {reviewError && (
                      <div className="mt-2 text-sm text-rose-600 dark:text-rose-200">
                        {reviewError}
                      </div>
                    )}

                    <div className="mt-3 flex justify-end">
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
                      >
                        {submittingReview ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </form>
                )}

                <div className="mt-4 space-y-4">
                  {displayedReviews.map((r) => (
                    <ReviewCard key={r.review_id || r.id} review={r} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <aside className="lg:sticky lg:top-20">
              <TourBookingCard
                price={item.price}
                currency={item.currency}
                title={item.title}
                rating={displayedRating}
                maxGroup={item.groupSize}
                tour={item}
                guide={item.guide}
              />
            </aside>
          </div>
        </section>

        {related.length > 0 && (
          <FeaturedExperiences
            items={related}
            showPagination={false}
            limit={3}
            showHeaderAction={false}
            title="You might also like"
            subtitle={`More ${item.category.toLowerCase()} experiences`}
          />
        )}
        <Footer />
      </main>
    </>
  );
}

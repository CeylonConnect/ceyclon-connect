import React, { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom"; // ensure react-router-dom is installed and configured
import Navbar from "../components/Navbar";
import FeaturedExperiences from "../components/section/FeaturedExperiences";
import { EXPERIENCES_MOCK } from "../data/experiences.mock";
import TourBookingCard from "../components/tour/TourBookingCard";
import FAQAccordion from "../components/tour/FAQ";
import ReviewCard from "../components/tour/ReviewCard";
import Footer from "../components/Footer";

function Breadcrumbs({ title }) {
  return (
    <nav className="mx-auto max-w-6xl px-4 py-4 text-sm" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-neutral-500">
        <li><Link className="hover:text-neutral-800" to="/">Home</Link></li>
        <li className="text-neutral-400">/</li>
        <li><Link className="hover:text-neutral-800" to="/tours">Tours</Link></li>
        <li className="text-neutral-400">/</li>
        <li className="text-neutral-700 line-clamp-1" title={title}>{title}</li>
      </ol>
    </nav>
  );
}
function Hero({ item }) {
  return (
    <section className="relative isolate">
      <div className="absolute inset-0 -z-10">
        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
              <path d="m12 17.27 6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            <span className="font-semibold">{item.rating.value.toFixed(1)}</span>
            <span className="text-white/80">({item.rating.count} reviews)</span>
          </div>
          <span className="opacity-50">•</span>
          <div className="inline-flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-6.5 8-13A8 8 0 1 0 4 9c0 6.5 8 13 8 13Z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="2"/></svg>
            {item.location}
          </div>
          <span className="opacity-50">•</span>
          <div className="inline-flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            {item.durationHours}h
          </div>
          <span className="opacity-50">•</span>
          <div className="inline-flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M16 11a4 4 0 1 0-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M3 20a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Up to {item.groupSize}
          </div>
        </div>
      </div>
    </section>
  );
}

function Gallery({ main, extras }) {
  const [active, setActive] = useState(main);
  const images = useMemo(() => [main, ...extras].filter(Boolean), [main, extras]);
  return (
    <section className="mx-auto max-w-6xl px-4 -mt-10 relative">
      <div className="rounded-2xl overflow-hidden ring-1 ring-black/5 shadow-lg bg-white">
        <div className="grid gap-2 p-2 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <img src={active} alt="Gallery main" className="h-80 w-full rounded-xl object-cover sm:h-[28rem]" />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
            {images.slice(1, 5).map((src, idx) => (
              <button
                key={idx}
                className={`relative overflow-hidden rounded-xl ring-1 ring-black/5 transition ${active === src ? "outline outline-2 outline-orange-400" : "hover:opacity-90"}`}
                onClick={() => setActive(src)}
                aria-label={`Select image ${idx + 1}`}
              >
                <img src={src} alt={`Gallery ${idx + 1}`} className="h-36 w-full object-cover sm:h-[6.75rem]" />
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
      <h2 className="text-xl font-bold text-neutral-800">{title}</h2>
      <div className="mt-4 text-[15px] leading-relaxed text-neutral-700">
        {children}
      </div>
    </section>
  );
}

function GuideCard({ guide }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <img src={guide.avatar} alt={guide.name} className="h-14 w-14 rounded-full object-cover" />
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-neutral-800">{guide.name}</h4>
          {guide.verified && (
            <span className="text-amber-500" title="Verified">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 3 8v8l9 6 9-6V8l-9-6Zm-1 13-3-3 1.4-1.4L11 12.2l4.6-4.6L17 9l-6 6Z" /></svg>
            </span>
          )}
        </div>
        <p className="text-sm text-neutral-600">Local guide • 5+ years experience</p>
      </div>
      <div className="ml-auto">
        <Link to="/guides" className="text-sm font-semibold text-orange-600 hover:underline">View profile</Link>
      </div>
    </div>
  );
}

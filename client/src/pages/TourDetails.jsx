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

import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import TourFilters from "../components/filters/TourFilters";
import FeaturedExperiences from "../components/section/FeaturedExperiences";
import Footer from "../components/Footer";
import { getAllTours, toExperienceItem } from "../api1/tours";
import { EXPERIENCES_MOCK } from "../data/experiences.mock";

export default function ToursPage() {
  const [allItems, setAllItems] = useState(EXPERIENCES_MOCK);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const tours = await getAllTours();
        if (!mounted) return;
        setAllItems(tours.map(toExperienceItem));
      } catch (e) {
        // Keep mock fallback if API is unreachable.
        console.error("Failed to load tours for Tours page", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Build options from data
  const districts = useMemo(
    () =>
      Array.from(
        new Set(allItems.map((i) => i.location).filter(Boolean))
      ).sort(),
    [allItems]
  );
  const providers = useMemo(
    () =>
      Array.from(
        new Set(allItems.map((i) => i.guide?.name).filter(Boolean))
      ).sort(),
    [allItems]
  );
  const categories = useMemo(
    () =>
      Array.from(
        new Set(allItems.map((i) => i.category).filter(Boolean))
      ).sort(),
    [allItems]
  );

  const [filters, setFilters] = useState({
    district: "",
    provider: "",
    minPrice: "",
    maxPrice: "",
    categories: [], // multi-select
  });

  const reset = () =>
    setFilters({
      district: "",
      provider: "",
      minPrice: "",
      maxPrice: "",
      categories: [],
    });

  const filteredItems = useMemo(() => {
    const min = filters.minPrice !== "" ? Number(filters.minPrice) : -Infinity;
    const max = filters.maxPrice !== "" ? Number(filters.maxPrice) : Infinity;

    return allItems.filter((i) => {
      const byDistrict = filters.district
        ? i.location === filters.district
        : true;
      const byProvider = filters.provider
        ? i.guide?.name === filters.provider
        : true;
      const byPrice = i.price >= min && i.price <= max;
      const byCategory =
        filters.categories.length > 0
          ? filters.categories.includes(i.category)
          : true;

      return byDistrict && byProvider && byPrice && byCategory;
    });
  }, [filters, allItems]);

  return (
    <>
      <Navbar
        isAuthenticated={false}
        onLoginClick={() => (window.location.href = "/login")}
        onSignupClick={() => (window.location.href = "/signup")}
        onDashboardClick={() => (window.location.href = "/dashboard")}
      />

      <main className="bg-white dark:bg-black">
        {/* Filters */}
        <div className="pt-8 pb-4">
          <TourFilters
            districts={districts}
            providers={providers}
            categories={categories}
            values={filters}
            onChange={setFilters}
            onReset={reset}
          />
        </div>

        {/* Listing (pagination on, header action hidden for /tour) */}
        {filteredItems.length === 0 ? (
          <section className="mx-auto max-w-6xl px-4 pb-16">
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-600 dark:border-neutral-800 dark:bg-black dark:text-neutral-300">
              No tours match the selected filters. Try adjusting your search.
            </div>
          </section>
        ) : (
          <FeaturedExperiences
            items={filteredItems}
            showPagination
            itemsPerPage={6}
            showHeaderAction={false}
            title="Browse Tours"
            subtitle="Filter by district, provider, category, and price to find your perfect experience"
          />
        )}
        <Footer />
      </main>
    </>
  );
}

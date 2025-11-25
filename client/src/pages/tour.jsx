import React, { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import TourFilters from "../components/filters/TourFilters";
import FeaturedExperiences from "../components/section/FeaturedExperiences";
import { EXPERIENCES_MOCK } from "../data/experiences.mock";
import Footer from "../components/Footer";

export default function ToursPage() {
  // Build options from data
  const districts = useMemo(
    () => Array.from(new Set(EXPERIENCES_MOCK.map((i) => i.location))).sort(),
    []
  );
  const providers = useMemo(
    () => Array.from(new Set(EXPERIENCES_MOCK.map((i) => i.guide.name))).sort(),
    []
  );
  const categories = useMemo(
    () => Array.from(new Set(EXPERIENCES_MOCK.map((i) => i.category))).sort(),
    []
  );

  const [filters, setFilters] = useState({
    district: "",
    provider: "",
    minPrice: "",
    maxPrice: "",
    categories: [], // multi-select
  });

  const reset = () =>
    setFilters({ district: "", provider: "", minPrice: "", maxPrice: "", categories: [] });

  const filteredItems = useMemo(() => {
    const min = filters.minPrice !== "" ? Number(filters.minPrice) : -Infinity;
    const max = filters.maxPrice !== "" ? Number(filters.maxPrice) : Infinity;

    return EXPERIENCES_MOCK.filter((i) => {
      const byDistrict = filters.district ? i.location === filters.district : true;
      const byProvider = filters.provider ? i.guide.name === filters.provider : true;
      const byPrice = i.price >= min && i.price <= max;
      const byCategory =
        filters.categories.length > 0 ? filters.categories.includes(i.category) : true;

      return byDistrict && byProvider && byPrice && byCategory;
    });
  }, [filters]);

  return (
    <>
      <Navbar
        isAuthenticated={false}
        onLoginClick={() => (window.location.href = "/login")}
        onSignupClick={() => (window.location.href = "/signup")}
        onDashboardClick={() => (window.location.href = "/dashboard")}
      />

      <main className="bg-white">
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
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-600">
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

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

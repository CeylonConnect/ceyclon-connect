import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import HowCeylonConnectWorks from "../components/section/HowCeyloneConnectWork";
import FeaturedExperiences from "../components/section/FeaturedExperiences";
import TravelWithConfidence from "../components/section/TravelWithConfidence";
import UpcomingEvents from "../components/section/UpComingEvents";
import ExploreCTA from "../components/section/ExploreCTA";
import Footer from "../components/Footer";
import { getAllTours, toExperienceItem } from "../api1/tours";
import { EXPERIENCES_MOCK } from "../data/experiences.mock";

export default function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState(EXPERIENCES_MOCK);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const tours = await getAllTours();
        if (!mounted) return;
        setFeatured(tours.map(toExperienceItem));
      } catch (e) {
        // Keep the mock fallback if the API is unreachable.
        console.error("Failed to load tours for Home", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <Navbar
        isAuthenticated={false}
        onLoginClick={() => navigate("/login")}
        onSignupClick={() => navigate("/signup")}
        onDashboardClick={() => navigate("/dashboard")}
      />
      <main>
        <Hero />
        <HowCeylonConnectWorks />
        <FeaturedExperiences
          items={featured}
          showPagination={false}
          limit={6}
        />
        <TravelWithConfidence />
        <UpcomingEvents showPagination={false} limit={2} />
        <ExploreCTA />
        <Footer />
      </main>
    </>
  );
}

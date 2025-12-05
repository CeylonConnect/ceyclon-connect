import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import HowCeylonConnectWorks from "../components/section/HowCeyloneConnectWork";
import FeaturedExperiences from "../components/section/FeaturedExperiences";
import TravelWithConfidence from "../components/section/TravelWithConfidence";
import UpcomingEvents from "../components/section/UpComingEvents";
import ExploreCTA from "../components/section/ExploreCTA";

export default function Home() {
  const navigate = useNavigate();

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
        <FeaturedExperiences showPagination={false} limit={6} />
        <TravelWithConfidence />
        <UpcomingEvents showPagination={false} limit={2} />
        <ExploreCTA />
      </main>
    </>
  );
}

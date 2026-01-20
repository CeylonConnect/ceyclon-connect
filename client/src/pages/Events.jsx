import React from "react";
import Navbar from "../components/Navbar";
import UpcomingEvents from "../components/section/UpComingEvents";
import Footer from "../components/Footer";

function Hero() {
  return (
    <section className="relative isolate">
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#e86d39] via-[#d88a3f] to-[#179c93]" />
      <div className="mx-auto max-w-6xl px-4 py-16 text-white sm:py-20 md:py-24">
        <h1 className="text-3xl font-extrabold sm:text-5xl md:text-6xl">
          Cultural Events in Sri Lanka
        </h1>
        <p className="mt-4 max-w-3xl text-white/95 text-lg">
          Experience the vibrant festivals and celebrations throughout the year
        </p>
      </div>
    </section>
  );
}


export default function EventsPage() {
  return (
    <>
      <Navbar
        isAuthenticated={false}
        onLoginClick={() => (window.location.href = "/login")}
        onSignupClick={() => (window.location.href = "/signup")}
        onDashboardClick={() => (window.location.href = "/dashboard")}
      />
      <main>
        <Hero />
        {/* Full events listing with pagination and images */}
        <UpcomingEvents showPagination itemsPerPage={2} />
      </main>
      <Footer />
    </>
  );
}

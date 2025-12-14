import React from "react";

export default function Hero() {
  return (
    <section className="relative isolate">
      {/* Background image */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/vite.svg')" }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 -z-0 bg-gradient-to-r from-[#e86d39]/40 via-[#d88a3f]/30 to-[#179c93]/40" />

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-24 sm:py-28 md:py-36 text-center text-white">
        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-[1.1] drop-shadow-lg">
          Discover Authentic Sri Lanka
        </h1>

        {/* Subheading */}
        <p className="mx-auto mt-5 max-w-3xl text-lg md:text-xl text-white/95 drop-shadow-lg">
          Connect with local guides for personalized tours beyond the tourist trail
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {/* Explore Tours with animated search icon */}
          <a
            href="#discover"
            className="inline-flex items-center gap-3 rounded-xl bg-white/95 px-5 py-3 text-base font-semibold text-neutral-800 shadow-md transition hover:bg-white hover:shadow-lg hover:scale-105 transform"
          >
            <svg
              className="w-6 h-6 text-neutral-800 animate-bounce"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            Explore Tours
          </a>

          {/* Become a Guide button */}
          <a
            href="/signup"
            className="group relative inline-flex h-12 w-56 items-center justify-center rounded-xl bg-white/95 text-base font-semibold text-neutral-800 shadow-md transition hover:bg-white hover:shadow-lg hover:scale-105 transform"
          >
            <span className="opacity-50 transition-opacity duration-200 group-hover:opacity-100">
              Become a Guide
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

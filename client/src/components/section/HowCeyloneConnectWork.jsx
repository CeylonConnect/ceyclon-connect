import React from "react";

function RevealBrowseButton() {
  // White pill that reveals "Browse Tours" only on hover
  return (
    <a
      href="/tours"
      aria-label="Browse Tours"
      className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl bg-white/95 px-6 text-base font-semibold text-neutral-800 shadow-md transition hover:bg-white hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
    >
      {/* Optional leading icon that is always visible */}
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

      {/* Reveal text: hidden until hover */}
      <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-out group-hover:ml-3 group-hover:max-w-[200px] group-hover:opacity-100">
        Browse Tours
      </span>

      {/* Subtle shine sweep on hover (no custom keyframes needed) */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 transition duration-500 ease-out group-hover:translate-x-full group-hover:opacity-100" />
    </a>
  );
}

export default function ExploreCTA() {
  return (
    <section className="relative isolate">
      {/* Background image */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/vite.svg')" }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 -z-0 bg-gradient-to-r from-[#e86d39]/80 via-[#d88a3f]/60 to-[#179c93]/80" />

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-white sm:py-24 md:py-28">
        <h2 className="text-3xl font-extrabold sm:text-4xl md:text-5xl drop-shadow-md">
          Ready to Explore Sri Lanka?
        </h2>
        <p className="mx-auto mt-5 max-w-3xl text-lg md:text-xl text-white/95 drop-shadow-lg">
          Join thousands of travelers discovering authentic experiences with local guides
        </p>


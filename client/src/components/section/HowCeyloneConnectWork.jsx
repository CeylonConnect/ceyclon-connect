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

import React from "react";

export default function TopbarLocal({ name = "Guide" }) {
  return (
    <header className="relative isolate">
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500" />
      <div className="mx-auto max-w-7xl px-4 py-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold">Local Guide Dashboard</h1>
            <p className="text-white/90">Welcome, {name}!</p>
          </div>
          <a
            href="/"
            className="rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/25"
          >
            Home
          </a>
        </div>
      </div>
    </header>
  );
}
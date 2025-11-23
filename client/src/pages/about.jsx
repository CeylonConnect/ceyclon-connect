import React from "react";
import Navbar from "../components/Navbar";
import Reveal from "../components/motion/Reveal";
import Footer from "../components/Footer";

function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow && (
        <div className="inline-flex items-center justify-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
          {eyebrow}
        </div>
      )}
      <h2 className="mt-3 text-3xl font-extrabold text-neutral-900 sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-2xl text-neutral-600">{subtitle}</p>
      )}
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
      <div className="text-3xl font-extrabold text-neutral-900">{value}</div>
      <div className="mt-1 text-sm text-neutral-600">{label}</div>
    </div>
  );
}

function ValueCard({ icon, title, desc }) {
  return (
    <div className="group rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-yellow-100 text-orange-600">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-neutral-800">{title}</h3>
      <p className="mt-2 text-sm text-neutral-600">{desc}</p>
    </div>
  );
}

function TeamCard({ name, role, avatar }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm">
      <img
        src={avatar}
        alt={name}
        className="mx-auto h-20 w-20 rounded-full object-cover shadow"
      />
      <h4 className="mt-3 text-base font-semibold text-neutral-800">{name}</h4>
      <p className="text-sm text-neutral-500">{role}</p>
    </div>
  );
}

export default function About() {
  return (
    <>
      <Navbar
        isAuthenticated={false}
        onLoginClick={() => (window.location.href = "/login")}
        onSignupClick={() => (window.location.href = "/signup")}
        onDashboardClick={() => (window.location.href = "/dashboard")}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        {/* Animated brand gradient background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#e86d39] via-[#d88a3f] to-[#179c93]" />
        {/* Decorative floating orbs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-10 top-24 h-40 w-40 rounded-full bg-orange-200/40 blur-3xl animate-float-slow" />
          <div className="absolute right-10 top-16 h-56 w-56 rounded-full bg-teal-200/40 blur-3xl animate-float-rev" />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-20 text-white sm:py-24 md:py-28">

          <Reveal className="mt-8">
            <h1 className="text-center text-4xl font-extrabold sm:text-5xl md:text-6xl">
              About CeylonConnect
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-center text-white/95 text-lg">
              We connect travelers with trusted local guides to discover the
              real Sri Lanka — beyond the tourist trail.
            </p>
          </Reveal>

          {/* Hero CTAs */}
          <Reveal className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/tours"
              className="inline-flex items-center gap-3 rounded-xl bg-white/95 px-5 py-3 text-base font-semibold text-neutral-800 shadow-md transition hover:bg-white hover:shadow-lg"
            >
              Explore Tours
            </a>
            <a
              href="/signup"
              className="relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl bg-white/10 px-6 text-base font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/20"
            >
              <span className="relative z-10">Become a Guide</span>
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition duration-500 ease-out hover:translate-x-full hover:opacity-100" />
            </a>
          </Reveal>
        </div>
      </section>

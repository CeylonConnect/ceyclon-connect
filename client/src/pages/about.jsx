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

      
      {/* Mission + Stats */}
      <section className="relative bg-[linear-gradient(180deg,#fff,rgba(255,250,240,.6))]">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Reveal>
            <SectionTitle
              eyebrow="Our Mission"
              title="Empowering local guides. Enriching traveler journeys."
              subtitle="We believe the most memorable trips are led by people who call the destination home. Our platform helps you meet verified local experts, customize experiences, and travel responsibly."
            />
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Reveal>
              <Stat value="2,500+" label="Happy travelers" />
            </Reveal>
            <Reveal>
              <Stat value="450+" label="Verified guides" />
            </Reveal>
            <Reveal>
              <Stat value="120+" label="Destinations covered" />
            </Reveal>
            <Reveal>
              <Stat value="4.8/5" label="Average tour rating" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Story timeline */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Reveal>
            <SectionTitle
              eyebrow="Our Story"
              title="From a simple idea to a vibrant community"
              subtitle="CeylonConnect started with a small group of guides who wanted to share authentic stories. Today, we’re a growing community building meaningful connections."
            />
          </Reveal>

          <div className="mt-10 relative">
            <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-neutral-200 md:block" />
            <div className="space-y-8">
              {[
                {
                  year: "2025",
                  title: "Project Idea Born",
                  text: "Our team identified the need for a digital platform to promote clean environments across Sri Lanka and improve community awareness.",
                },
                {
                  year: "2025",
                  title: "Team Formation",
                  text: "We formed our mini-project team, gathered requirements, and started planning core features such as event updates, user login, and community support.",
                },
                {
                  year: "2025",
                  title: "Prototype & Development",
                  text: "We designed the UI, built the frontend using React, and developed the backend system to manage events, sponsors, and user interactions.",
                },
              ].map((it, idx) => (
                <Reveal
                  key={it.year}
                  className={`relative rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:w-[calc(50%-1rem)] ${
                    idx % 2 === 0 ? "md:ml-auto" : "md:mr-auto"
                  }`}
                >
                  <div className="text-xs font-semibold text-orange-600">
                    {it.year}
                  </div>
                  <div className="mt-1 text-lg font-semibold text-neutral-800">
                    {it.title}
                  </div>
                  <p className="mt-2 text-sm text-neutral-600">{it.text}</p>

                  {/* Connector dot for md+ */}
                  <div
                    className={`hidden md:block absolute top-6 h-3 w-3 rounded-full bg-gradient-to-br from-orange-500 to-teal-500 ring-4 ring-white ${
                      idx % 2 === 0 ? "-left-1.5" : "-right-1.5"
                    }`}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

        {/* Values */}
      <section className="bg-[linear-gradient(180deg,rgba(255,250,240,.6),#fff)]">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Reveal>
            <SectionTitle
              eyebrow="Our Values"
              title="What we stand for"
              subtitle="The principles guiding every experience on CeylonConnect."
            />
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Reveal>
              <ValueCard
                title="Authenticity"
                desc="Real stories, real locals, real culture — beyond generic itineraries."
                icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="m12 17.3 6.2 3.7-1.6-7 5-4.7-7.1-.6L12 2 9.5 8.7 2.4 9.3l5 4.7-1.6 7z" />
                  </svg>
                }
              />
            </Reveal>
            <Reveal>
              <ValueCard
                title="Safety"
                desc="Guide verification, secure payments, and responsive support."
                icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2 4 6v6c0 5 8 10 8 10s8-5 8-10V6l-8-4Zm-1 13-3-3 1.4-1.4L11 12.2l4.6-4.6L17 9l-6 6Z" />
                  </svg>
                }
              />
            </Reveal>
            <Reveal>
              <ValueCard
                title="Community"
                desc="Travel that supports local livelihoods and preserves heritage."
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 10a3 3 0 1 1 6 0M3 20a6 6 0 0 1 6-6h6a6 6 0 0 1 6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                }
              />
            </Reveal>
            <Reveal>
              <ValueCard
                title="Sustainability"
                desc="Respecting nature and culture through responsible practices creating a cleaner tomorrow."
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 22s8-6.5 8-13A8 8 0 1 0 4 9c0 6.5 8 13 8 13Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle
                      cx="12"
                      cy="9"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                }
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#e86d39] via-[#d88a3f] to-[#179c93]" />
        <div className="mx-auto max-w-6xl px-4 py-16 text-center text-white sm:py-20">
          <Reveal>
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Ready to explore with locals?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-white/95">
              Discover curated experiences or become a guide and share your Sri
              Lankan story.
            </p>
          </Reveal>

          <Reveal className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/tours"
              className="inline-flex items-center justify-center rounded-xl bg-white/95 px-6 py-3 text-base font-semibold text-neutral-800 shadow-md transition hover:bg-white hover:shadow-lg"
            >
              Explore Tours
            </a>
            <a
              href="/signup"
              className="relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl bg-white/10 px-6 text-base font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/20"
            >
              <span className="relative z-10">Get Started</span>
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition duration-500 ease-out hover:translate-x-full hover:opacity-100" />
            </a>
          </Reveal>
        </div>
      </section>
      <Footer />
    </>
  );
}

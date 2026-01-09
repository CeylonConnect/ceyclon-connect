import React from "react";

function StepCard({ tone = "orange", title, desc, number, icon }) {
  const tones = {
    orange: {
      bg: "bg-orange-50 dark:bg-orange-500/10",
      ring: "ring-orange-100 dark:ring-orange-500/20",
      text: "text-orange-600 dark:text-orange-300",
    },
    teal: {
      bg: "bg-teal-50 dark:bg-teal-500/10",
      ring: "ring-teal-100 dark:ring-teal-500/20",
      text: "text-teal-600 dark:text-teal-300",
    },
    yellow: {
      bg: "bg-yellow-50 dark:bg-amber-500/10",
      ring: "ring-yellow-100 dark:ring-amber-500/20",
      text: "text-amber-500 dark:text-amber-300",
    },
  }[tone];

  return (
    <div className="group rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-black dark:ring-white/10">
      <div
        className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${tones.bg} ${tones.ring} ring-1 transition-transform duration-300 animate-bounce-slow`}
      >
        <div className={`${tones.text} w-10 h-10`}>{icon}</div>
      </div>
      <h3 className="text-xl font-semibold text-neutral-800 dark:text-white">
        {number}. {title}
      </h3>
      <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300">
        {desc}
      </p>
    </div>
  );
}

export default function HowCeylonConnectWorks() {
  return (
    <section className="bg-neutral-50 dark:bg-black">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-neutral-800 dark:text-white">
          How CeylonConnect Works
        </h2>
        <p className="mx-auto mt-3 max-w-3xl text-center text-lg text-neutral-600 dark:text-neutral-300">
          Your journey to authentic Sri Lankan experiences in three simple steps
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3 md:gap-8">
          <StepCard
            number={1}
            title="Discover Tours"
            desc="Browse authentic experiences curated by verified local guides across Sri Lanka"
            tone="orange"
            icon={
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-3.6-3.6" />
              </svg>
            }
          />
          <StepCard
            number={2}
            title="Connect & Book"
            desc="Chat with guides, customize your tour, and book securely through our platform"
            tone="teal"
            icon={
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              >
                <path d="M21 12a7 7 0 0 1-7 7H7l-4 3V12a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7Z" />
              </svg>
            }
          />
          <StepCard
            number={3}
            title="Experience & Share"
            desc="Enjoy your personalized tour and share your experience to help other travelers"
            tone="yellow"
            icon={
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="m12 17.3 6.2 3.7-1.6-7 5-4.7-7.1-.6L12 2 9.5 8.7 2.4 9.3l5 4.7-1.6 7z" />
              </svg>
            }
          />
        </div>
      </div>
    </section>
  );
}

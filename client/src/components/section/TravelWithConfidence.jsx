
import React from "react";

const toneMap = {
  yellow: {
    bg: "bg-yellow-50",
    ring: "ring-yellow-100",
    text: "text-amber-500",
  },
  orange: {
    bg: "bg-orange-50",
    ring: "ring-orange-100",
    text: "text-orange-500",
  },
  teal: {
    bg: "bg-teal-50",
    ring: "ring-teal-100",
    text: "text-teal-600",
  },
  green: {
    bg: "bg-emerald-50",
    ring: "ring-emerald-100",
    text: "text-emerald-600",
  },
};

// Mock data
const DEFAULT_FEATURES = [
  {
    id: "verified",
    title: "Verified Guides",
    desc: "All guides undergo background checks and certification",
    tone: "yellow",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2 4 6v6c0 5 8 10 8 10s8-5 8-10V6l-8-4Zm-1 13-3-3 1.4-1.4L11 12.2l4.6-4.6L17 9l-6 6Z" />
      </svg>
    ),
  },
{
    id: "reviews",
    title: "Trusted Reviews",
    desc: "Authentic reviews from verified travelers",
    tone: "orange",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="m12 17.3 6.2 3.7-1.6-7 5-4.7-7.1-.6L12 2 9.5 8.7 2.4 9.3l5 4.7-1.6 7z" />
      </svg>
    ),
  },

  {
    id: "community",
    title: "Community Support",
    desc: "Direct support for local communities and families",
    tone: "teal",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path
          d="M9 10a3 3 0 1 1 6 0M3 20a6 6 0 0 1 6-6h6a6 6 0 0 1 6 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "expertise",
    title: "Local Expertise",
    desc: "Authentic experiences with insider knowledge",
    tone: "green",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 22s8-6.5 8-13A8 8 0 1 0 4 9c0 6.5 8 13 8 13Z" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
];
  
function Feature({ item }) {
  const tone = toneMap[item.tone] ?? toneMap.orange;
  return (
    <div className="flex flex-col items-center text-center">
      {/* Icon with animation */}
      <div
        className={`mb-5 flex h-20 w-20 items-center justify-center rounded-full ${tone.bg} ${tone.ring} ring-1 animate-float`}
      >
        <span className={`${tone.text}`}>{item.icon}</span>
      </div>
      <h3 className="text-lg font-semibold text-neutral-800">{item.title}</h3>
      <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-neutral-600">{item.desc}</p>
    </div>
  );
}


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

import React, { useEffect, useState } from "react";
import { getGuideAverageRating, getReviewsByGuide } from "../../api1/reviews";
import Reveal from "../motion/Reveal2";

function Stars({ value = 0 }) {
  const v = Math.round(value);
  return (
    <div className="flex items-center gap-1 text-amber-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < v ? "currentColor" : "none"}
          stroke="currentColor"
        >
          <path d="m12 17.27 6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}
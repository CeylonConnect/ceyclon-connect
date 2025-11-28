import React from "react";

export default function ReviewCard({ review }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <img src={review.avatar} alt={review.author} className="h-12 w-12 rounded-full object-cover" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-neutral-800">{review.author}</div>
          <div className="text-xs text-neutral-500">{new Date(review.date).toLocaleDateString()}</div>
        </div>
        <div className="mt-1 flex items-center gap-1 text-amber-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor">
              <path d="m12 17.27 6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          ))}
        </div>
        <p className="mt-2 text-[15px] text-neutral-700">{review.text}</p>
      </div>
    </div>
  );
}

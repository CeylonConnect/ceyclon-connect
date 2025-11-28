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

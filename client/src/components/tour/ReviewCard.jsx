import React from "react";

export default function ReviewCard({ review }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <img src={review.avatar} alt={review.author} className="h-12 w-12 rounded-full object-cover" />
      <div className="flex-1">

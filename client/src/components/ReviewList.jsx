import React from "react";

export default function ReviewList({ reviews = [], onEdit, onDelete }) {
  if (!reviews.length) return <p>No reviews yet.</p>;
  return (
    <ul>
      {reviews.map(rv => (
        <li key={rv.review_id} className="mb-4 border p-3 rounded">
          <div className="flex justify-between">
            <div>
              <strong>{rv.user?.first_name ?? "User" } {rv.user?.last_name ?? ""}</strong>
              <div>{rv.rating} ★</div>
            </div>
            <div>
              <small>{new Date(rv.created_at).toLocaleString()}</small>
            </div>
          </div>
          <p className="mt-2">{rv.review_text}</p>
          <div className="mt-2 space-x-2">
            <button onClick={() => onEdit(rv)}>Edit</button>
            <button onClick={() => onDelete(rv.review_id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

import React from "react";

export default function Tabs({ value, onChange, items }) {
  return (
    <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-1">
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      >
        {items.map((it) => (
          <button
            key={it.value}
            onClick={() => onChange(it.value)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              value === it.value ? "bg-white shadow-sm" : "hover:bg-white/60"
            }`}
          >
            {it.label}
          </button>
        ))}
      </div>
    </div>
  );
}
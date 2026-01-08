import React from "react";

export default function Tabs({ value, onChange, items }) {
  return (
    <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-800 dark:bg-neutral-950">
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
        }}
      >
        {items.map((it) => (
          <button
            key={it.value}
            onClick={() => onChange(it.value)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              value === it.value
                ? "bg-white shadow-sm dark:bg-neutral-900 dark:text-white"
                : "hover:bg-white/60 dark:text-neutral-200 dark:hover:bg-neutral-900/60"
            }`}
          >
            {it.label}
          </button>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from "react";

function Item({ q, a, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-neutral-200 last:border-none dark:border-neutral-800">
      <button
        type="button"
        className="flex w-full items-center justify-between py-3 text-left"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="font-medium text-neutral-800 dark:text-white">
          {q}
        </span>
        <span className={`transition ${open ? "rotate-180" : ""}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>
      {open && (
        <div className="pb-3 text-[15px] text-neutral-700 dark:text-neutral-300">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQAccordion({ items = [] }) {
  if (!items.length) return null;
  return (
    <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
      {items.map((it, idx) => (
        <Item key={idx} q={it.q} a={it.a} defaultOpen={idx === 0} />
      ))}
    </div>
  );
}

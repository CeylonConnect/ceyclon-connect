import React from "react";
import Reveal from "../motion/Reveal";

export default function SummaryStat({ icon, label, value, sub }) {
  return (
    <Reveal className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur-md ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-neutral-700">{label}</div>
          <div className="mt-2 text-3xl font-extrabold text-neutral-900">{value}</div>
          {sub && <div className="text-xs text-neutral-500">{sub}</div>}
        </div>
        <div className="text-neutral-500">{icon}</div>
      </div>
    </Reveal>
  );
}
import React from "react";

export default function TourFilters({
  districts = [],
  providers = [],
  categories = [],
  values,
  onChange,
  onReset,
}) {
  const set = (key, val) => onChange({ ...values, [key]: val });
  const toggleCategory = (cat) => {
    const current = values.categories || [];
    const next = current.includes(cat)
      ? current.filter((c) => c !== cat)
      : [...current, cat];
    set("categories", next);
  };

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-5">
          {/* District */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-medium text-neutral-600">District</label>
            <select
              value={values.district}
              onChange={(e) => set("district", e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-orange-400/40"
            >
              <option value="">All districts</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Provider */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-medium text-neutral-600">Provider</label>
            <select
              value={values.provider}
              onChange={(e) => set("provider", e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-orange-400/40"
            >
              <option value="">All providers</option>
              {providers.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          
        </div>
        
      </div>
    </div>
  );
}
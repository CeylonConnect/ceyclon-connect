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

          {/* Price range */}
          <div className="md:col-span-1">
            <label className="mb-1 block text-xs font-medium text-neutral-600">Price range (USD)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="Min"
                value={values.minPrice}
                onChange={(e) => set("minPrice", e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-orange-400/40"
              />
              <span className="text-neutral-400">–</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="Max"
                value={values.maxPrice}
                onChange={(e) => set("maxPrice", e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-orange-400/40"
              />
            </div>
          </div>

          
        </div>

        {/* Categories (multi-select pills) */}
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-xs font-medium text-neutral-600">Categories</label>
            <button
              type="button"
              onClick={() => set("categories", [])}
              className="text-xs font-semibold text-neutral-600 hover:text-neutral-800"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = (values.categories || []).includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={[
                    "rounded-full px-3 py-1.5 text-sm transition border",
                    active
                      ? "text-neutral-800 border-transparent bg-gradient-to-r from-orange-100 to-yellow-100"
                      : "text-neutral-700 border-neutral-200 hover:bg-neutral-50",
                  ].join(" ")}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
        
      </div>
    </div>
  );
}
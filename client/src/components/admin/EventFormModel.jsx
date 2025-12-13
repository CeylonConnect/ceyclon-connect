import React, { useEffect, useState } from "react";

export default function EventFormModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    type: "",
    time: "",
    image: "",
  });

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || "",
        description: initial.description || "",
        location: initial.location || "",
        startDate: initial.startDate ? initial.startDate.slice(0, 10) : "",
        endDate: initial.endDate ? initial.endDate.slice(0, 10) : "",
        type: initial.type || "",
        time: initial.time || "",
        image: initial.image || "",
      });
    } else {
      setForm({
        title: "",
        description: "",
        location: "",
        startDate: "",
        endDate: "",
        type: "",
        time: "",
        image: "",
      });
    }
  }, [initial]);

  if (!open) return null;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">
            {initial ? "Edit Event" : "Create Event"}
          </h3>
          <button onClick={onClose} className="rounded-md px-2 py-1 text-neutral-500 hover:bg-neutral-100">
            ✕
          </button>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-neutral-600">Title</label>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-neutral-600">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600">District</label>
            <input
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600">Category</label>
            <input
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600">Start Date</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => set("startDate", e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600">End Date</label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => set("endDate", e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600">Time</label>
            <input
              placeholder="e.g., 19:00"
              value={form.time}
              onChange={(e) => set("time", e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600">Image URL</label>
            <input
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:brightness-105"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
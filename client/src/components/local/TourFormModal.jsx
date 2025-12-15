import React, { useEffect, useRef, useState } from "react";

export default function TourFormModal({ open, onClose, onSave, initial }) {
  // State
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    durationHours: 4,
    groupSize: 8,
    price: 50,
    currency: "$",
    image: "",
    status: "active",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  // Refs
  const inputRef = useRef(null);
  const dropRef = useRef(null);

  // Effect: load initial tour data (runs consistently regardless of "open")
  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || "",
        description: initial.description || "",
        location: initial.location || "",
        category: initial.category || "",
        durationHours: initial.durationHours || 4,
        groupSize: initial.groupSize || 8,
        price: initial.price || 50,
        currency: initial.currency || "$",
        image: initial.image || "",
        status: initial.status || "active",
      });
      setPreview(initial.image || "");
      setImageFile(null);
    } else {
      setForm((f) => ({ ...f, title: "", description: "", image: "" }));
      setPreview("");
      setImageFile(null);
    }
  }, [initial]);

  // Effect: drag & drop listeners (declare hook unconditionally; bind only when open)
  useEffect(() => {
    if (!open) return;
    const zone = dropRef.current;
    if (!zone) return;
    const prevent = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const onDrop = (e) => {
      prevent(e);
      const file = e.dataTransfer.files?.[0];
      handleFile(file);
    };
    zone.addEventListener("dragenter", prevent);
    zone.addEventListener("dragover", prevent);
    zone.addEventListener("dragleave", prevent);
    zone.addEventListener("drop", onDrop);
    return () => {
      zone.removeEventListener("dragenter", prevent);
      zone.removeEventListener("dragover", prevent);
      zone.removeEventListener("dragleave", prevent);
      zone.removeEventListener("drop", onDrop);
    };
  }, [open]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleFile = (file) => {
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!imageFile) {
      alert("Please choose an image first.");
      return;
    }
    try {
      setUploading(true);
      // TODO: replace with real upload (multipart/form-data) and set form.image to returned URL
      await new Promise((r) => setTimeout(r, 1200));
      const objectURL = URL.createObjectURL(imageFile);
      set("image", objectURL);
      alert("Image uploaded (demo). URL stored in form.image.");
    } catch (e) {
      alert(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setPreview("");
    set("image", "");
    if (inputRef.current) inputRef.current.value = "";
  };

  const submit = () => {
    if (!form.image && preview) {
      // Optional: persist preview as base64 if user didn't click Upload
      set("image", preview);
    }
    onSave({ ...form });
  };

  // Render nothing if not open (hooks above still always run in the same order)
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 p-4 overscroll-contain"
      role="dialog"
      aria-modal="true"
    >
      {/* Center container with capped height and internal scroll.
          Three rows: header (auto), content (scroll), footer (auto & always visible) */}
      <div className="mx-auto grid w-full max-w-3xl grid-rows-[auto,1fr,auto] rounded-2xl border border-neutral-200 bg-white shadow-xl max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <h3 className="text-lg font-semibold text-neutral-900">
            {initial ? "Edit Tour" : "Create New Tour"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-neutral-500 hover:bg-neutral-100"
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div className="min-h-0 overflow-y-auto px-6 pb-6">
          {/* Image Upload */}
          <div className="grid gap-6">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Tour Cover Image
              </label>
              <div
                ref={dropRef}
                className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-5 text-center transition hover:border-teal-400 hover:bg-teal-50"
              >
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-40 w-full rounded-lg object-cover shadow-sm sm:h-48"
                    />
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={clearImage}
                        className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100"
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        onClick={uploadImage}
                        disabled={uploading}
                        className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50 hover:brightness-105"
                      >
                        {uploading ? "Uploading..." : "Upload"}
                      </button>
                    </div>
                    {form.image && (
                      <p className="mt-2 truncate text-xs text-teal-700">
                        Stored URL: {form.image}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-neutral-500"
                      >
                        <path
                          d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 4.3L17.7 9 12 11.7 6.3 9 12 6.3ZM5 10.6l6 3.3v5.3l-6-3.4v-5.2Zm8 8.6v-5.3l6-3.3v5.2l-6 3.4Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                    <p className="mt-3 text-xs text-neutral-600">
                      Drag & drop an image here, or
                      <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="ml-1 underline decoration-teal-400 underline-offset-2 hover:text-neutral-800"
                      >
                        browse
                      </button>
                    </p>
                    <p className="mt-1 text-[11px] text-neutral-400">
                      JPG / PNG up to ~5MB
                    </p>
                  </div>
                )}
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                  className="hidden"
                />
              </div>

              {/* Manual URL fallback */}
              <div className="mt-3">
                <label className="mb-1 block text-xs font-medium text-neutral-600">
                  Or paste image URL
                </label>
                <input
                  value={form.image}
                  onChange={(e) => {
                    set("image", e.target.value);
                    setPreview(e.target.value);
                    setImageFile(null);
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm"
                />
                <p className="mt-1 text-[11px] text-neutral-400">
                  Pasting a URL skips upload.
                </p>
              </div>
            </div>

            {/* Main Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-neutral-600">
                  Title
                </label>
                <input
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-neutral-600">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-600">
                  District
                </label>
                <input
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-600">
                  Category
                </label>
                <input
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-600">
                  Duration (hours)
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.durationHours}
                  onChange={(e) => set("durationHours", Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-600">
                  Group Size
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.groupSize}
                  onChange={(e) => set("groupSize", Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-600">
                  Price
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => set("price", Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-600">
                  Currency
                </label>
                <input
                  value={form.currency}
                  onChange={(e) => set("currency", e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer (always visible) */}
        <div className="flex items-center justify-end gap-3 border-t border-neutral-200 bg-white px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-neutral-200 px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:brightness-105"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
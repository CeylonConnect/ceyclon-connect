import React, { useEffect, useRef, useState } from "react";
import { getCloudinarySignature } from "../../api1/uploads";
import { generateDescription } from "../../api/ai";
import { SRI_LANKA_DISTRICTS } from "../../data/districts";

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
    currency: "Rs. ",
    image: "",
    images: [],
    status: "active",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [generatingDesc, setGeneratingDesc] = useState(false);

  // Refs
  const inputRef = useRef(null);
  const dropRef = useRef(null);

  // Effect: load initial tour data (runs consistently regardless of "open")
  useEffect(() => {
    if (initial) {
      const initImages = Array.isArray(initial.images)
        ? initial.images.filter(Boolean)
        : initial.image
        ? [initial.image]
        : [];

      setForm({
        title: initial.title || "",
        description: initial.description || "",
        location: initial.location || "",
        category: initial.category || "",
        durationHours: initial.durationHours || 4,
        groupSize: initial.groupSize || 8,
        price: initial.price || 50,
        currency:
          String(initial.currency || "").trim() === "$" || !initial.currency
            ? "Rs. "
            : initial.currency,
        image: initImages[0] || initial.image || "",
        images: initImages,
        status: initial.status || "active",
      });
      setPreviews(initImages);
      setImageFiles([]);
    } else {
      setForm((f) => ({
        ...f,
        title: "",
        description: "",
        image: "",
        images: [],
      }));
      setPreviews([]);
      setImageFiles([]);
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
      handleFiles(e.dataTransfer.files);
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

  const generateTourDescription = async () => {
    try {
      setGeneratingDesc(true);
      const payload = {
        kind: "tour",
        title: form.title,
        location: form.location,
        category: form.category,
        durationHours: form.durationHours,
        groupSize: form.groupSize,
      };

      const res = await generateDescription(payload);
      const text = res?.description || "";
      if (!text.trim()) {
        alert("AI did not return a description. Try again.");
        return;
      }
      set("description", text);
    } catch (e) {
      alert(e?.message || "AI generation failed");
    } finally {
      setGeneratingDesc(false);
    }
  };

  const handleFiles = async (fileList) => {
    const list = Array.from(fileList || []).filter(Boolean);
    if (list.length === 0) return;

    const selected = list.slice(0, 4);
    setImageFiles(selected);

    // Preview selected local files
    const nextPreviews = await Promise.all(
      selected.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result || "");
            reader.readAsDataURL(file);
          })
      )
    );

    setPreviews(nextPreviews.filter(Boolean));
    set("image", "");
    set("images", []);
  };

  const uploadImageFileToCloudinary = async (file) => {
    const sig = await getCloudinarySignature("tours");
    const cloudName = sig?.cloudName;
    const apiKey = sig?.apiKey;
    const timestamp = sig?.timestamp;
    const signature = sig?.signature;
    const folder = sig?.folder;

    if (!cloudName || !apiKey || !timestamp || !signature) {
      throw new Error(
        "Upload not configured (missing Cloudinary signature data)"
      );
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    if (folder) formData.append("folder", folder);
    formData.append("signature", signature);

    const res = await fetch(url, { method: "POST", body: formData });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = json?.error?.message || "Cloudinary upload failed";
      throw new Error(msg);
    }

    const uploadedUrl = json?.secure_url || json?.url;
    if (!uploadedUrl) throw new Error("Upload succeeded but URL missing");
    return uploadedUrl;
  };

  const uploadImageFilesToCloudinary = async (files) => {
    const list = Array.from(files || [])
      .filter(Boolean)
      .slice(0, 4);
    if (list.length === 0) return [];

    // Upload sequentially for predictable behavior and easier error reporting.
    const uploaded = [];
    for (const file of list) {
      // eslint-disable-next-line no-await-in-loop
      const url = await uploadImageFileToCloudinary(file);
      uploaded.push(url);
    }
    return uploaded;
  };

  const uploadImages = async () => {
    if (!imageFiles || imageFiles.length === 0) {
      alert("Please choose up to 4 images first.");
      return;
    }
    try {
      setUploading(true);
      const uploadedUrls = await uploadImageFilesToCloudinary(imageFiles);
      set("images", uploadedUrls);
      set("image", uploadedUrls[0] || "");
      setPreviews(uploadedUrls);
      setImageFiles([]);
    } catch (e) {
      alert(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const clearImages = () => {
    setImageFiles([]);
    setPreviews([]);
    set("image", "");
    set("images", []);
    if (inputRef.current) inputRef.current.value = "";
  };

  const submit = async () => {
    if (!String(form.title || "").trim()) {
      alert("Title is required");
      return;
    }
    if (!String(form.location || "").trim()) {
      alert("District is required");
      return;
    }
    if (!String(form.category || "").trim()) {
      alert("Category is required");
      return;
    }

    try {
      let finalImages = Array.isArray(form.images)
        ? form.images.filter(Boolean)
        : [];

      // If user pasted a URL but images[] is empty, treat it as cover image.
      if (finalImages.length === 0 && form.image) {
        finalImages = [form.image];
      }

      // If user picked local files, auto-upload them on Save so the tour stores public URLs.
      if (imageFiles && imageFiles.length > 0) {
        setUploading(true);
        finalImages = await uploadImageFilesToCloudinary(imageFiles);
        set("images", finalImages);
        set("image", finalImages[0] || "");
        setPreviews(finalImages);
        setImageFiles([]);
      }

      onSave({
        ...form,
        image: finalImages[0] || "",
        images: finalImages,
      });
    } catch (e) {
      alert(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
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
      <div className="mx-auto grid w-full max-w-3xl grid-rows-[auto,1fr,auto] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl max-h-[85vh] dark:border-neutral-800 dark:bg-black">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            {initial ? "Edit Tour" : "Create New Tour"}
          </h3>
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div className="min-h-0 overflow-y-auto px-6 py-6">
          {/* Image Upload */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 sm:p-5">
              <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-300">
                Tour Photos (up to 4)
              </label>
              <div
                ref={dropRef}
                className="group relative flex min-h-[220px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-neutral-300 bg-white p-5 text-center transition hover:border-teal-400 hover:bg-teal-50 dark:border-neutral-800 dark:bg-black dark:hover:bg-neutral-900"
              >
                {previews.length > 0 ? (
                  <>
                    <div className="grid w-full grid-cols-2 gap-2">
                      {previews.slice(0, 4).map((src, idx) => (
                        <img
                          key={idx}
                          src={src}
                          alt={`Preview ${idx + 1}`}
                          className="h-24 w-full rounded-lg object-cover shadow-sm sm:h-28"
                        />
                      ))}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={clearImages}
                        className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900"
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        onClick={uploadImages}
                        disabled={uploading}
                        className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-105 disabled:opacity-50"
                      >
                        {uploading ? "Uploading..." : "Upload"}
                      </button>
                    </div>
                    {!!(form.images?.length || form.image) && (
                      <p className="mt-2 truncate text-xs text-teal-700 dark:text-teal-300">
                        Stored: {form.images?.length || (form.image ? 1 : 0)}{" "}
                        image(s)
                      </p>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm dark:bg-black dark:ring-1 dark:ring-white/10">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-neutral-500 dark:text-neutral-400"
                      >
                        <path
                          d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 4.3L17.7 9 12 11.7 6.3 9 12 6.3ZM5 10.6l6 3.3v5.3l-6-3.4v-5.2Zm8 8.6v-5.3l6-3.3v5.2l-6 3.4Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                    <p className="mt-3 text-xs text-neutral-600 dark:text-neutral-300">
                      Drag & drop up to 4 images here, or
                      <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="ml-1 underline decoration-teal-400 underline-offset-2 hover:text-neutral-800 dark:hover:text-neutral-200"
                      >
                        browse
                      </button>
                    </p>
                    <p className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
                      JPG / PNG up to ~5MB each
                    </p>
                  </div>
                )}
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden"
                />
              </div>

              {/* Manual URL fallback */}
              <div className="mt-3">
                <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-300">
                  Or paste cover image URL
                </label>
                <input
                  value={form.image}
                  onChange={(e) => {
                    const url = e.target.value;
                    set("image", url);
                    set("images", url ? [url] : []);
                    setPreviews(url ? [url] : []);
                    setImageFiles([]);
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-teal-400/30 dark:border-neutral-800 dark:bg-black dark:text-neutral-200 dark:placeholder:text-neutral-500"
                />
                <p className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
                  Pasting a URL sets the cover photo.
                </p>
              </div>
            </div>

            {/* Main Fields */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-black sm:p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    Title
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-teal-400/30 dark:border-neutral-800 dark:bg-black dark:text-neutral-200 dark:placeholder:text-neutral-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <div className="mb-1 flex items-center justify-between">
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-300">
                      Description
                    </label>
                    <button
                      type="button"
                      onClick={generateTourDescription}
                      disabled={generatingDesc}
                      className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-700 disabled:opacity-50 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-black dark:text-neutral-200 dark:hover:bg-neutral-900"
                      title="Generate description with AI"
                    >
                      {generatingDesc ? "Generating..." : "💫AI  Generate"}
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-teal-400/30 dark:border-neutral-800 dark:bg-black dark:text-neutral-200 dark:placeholder:text-neutral-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    District
                  </label>
                  <select
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-teal-400/30 dark:border-neutral-800 dark:bg-black dark:text-neutral-200"
                  >
                    <option value="">Select district</option>
                    {SRI_LANKA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-teal-400/30 dark:border-neutral-800 dark:bg-black dark:text-neutral-200"
                  >
                    <option value="">Select a category</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Food">Food</option>
                    <option value="Guide">Guide</option>
                    <option value="Activity">Activity</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    Duration (hours)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.durationHours}
                    onChange={(e) =>
                      set("durationHours", Number(e.target.value))
                    }
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-teal-400/30 dark:border-neutral-800 dark:bg-black dark:text-neutral-200"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    Group Size
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.groupSize}
                    onChange={(e) => set("groupSize", Number(e.target.value))}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-teal-400/30 dark:border-neutral-800 dark:bg-black dark:text-neutral-200"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    Price
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => set("price", Number(e.target.value))}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-teal-400/30 dark:border-neutral-800 dark:bg-black dark:text-neutral-200"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    Currency
                  </label>
                  <input
                    value={form.currency}
                    onChange={(e) => set("currency", e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-teal-400/30 dark:border-neutral-800 dark:bg-black dark:text-neutral-200 dark:placeholder:text-neutral-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer (always visible) */}
        <div className="flex items-center justify-end gap-3 border-t border-neutral-200 bg-neutral-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950">
          <button
            onClick={onClose}
            className="rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-teal-200/40"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

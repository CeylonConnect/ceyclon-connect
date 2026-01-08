import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../api/client";
import { generateDescription } from "../../api/ai";
import { SRI_LANKA_DISTRICTS } from "../../data/districts";

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

  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [generatingDesc, setGeneratingDesc] = useState(false);

  const imagePreview = useMemo(() => {
    if (form.image) return form.image;
    if (imageFile) return URL.createObjectURL(imageFile);
    return "";
  }, [form.image, imageFile]);

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

    setImageFile(null);
    setUploading(false);
    setUploadError("");
  }, [initial]);

  if (!open) return null;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const generateEventDescription = async () => {
    try {
      setGeneratingDesc(true);
      const payload = {
        kind: "event",
        title: form.title,
        location: form.location,
        type: form.type,
        startDate: form.startDate,
        endDate: form.endDate,
        time: form.time,
      };

      const res = await generateDescription(payload);
      const text = res?.description || "";
      if (!text.trim()) {
        setUploadError("AI did not return a description. Try again.");
        return;
      }
      set("description", text);
    } catch (e) {
      setUploadError(e?.message || "AI generation failed");
    } finally {
      setGeneratingDesc(false);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const sig = await api.get(
      `/uploads/cloudinary-signature?folder=${encodeURIComponent("events")}`
    );
    const { cloudName, apiKey, timestamp, folder, signature } = sig || {};

    if (!cloudName || !apiKey || !timestamp || !folder || !signature) {
      throw new Error("Upload not configured (Cloudinary signature failed)");
    }

    const url = `https://api.cloudinary.com/v1_1/${encodeURIComponent(
      cloudName
    )}/image/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("folder", folder);
    formData.append("signature", signature);

    const res = await fetch(url, { method: "POST", body: formData });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = json?.error?.message || "Cloudinary upload failed";
      throw new Error(msg);
    }

    const uploadedUrl = json?.secure_url || json?.url;
    if (!uploadedUrl) throw new Error("Upload succeeded but no URL returned");
    return uploadedUrl;
  };

  const onPickImage = async (file) => {
    if (!file) return;
    setUploadError("");
    setImageFile(file);

    try {
      setUploading(true);
      const uploaded = await uploadImageToCloudinary(file);
      set("image", uploaded);
    } catch (e) {
      setUploadError(e?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-black">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            {initial ? "Edit Event" : "Create Event"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-300">
              Title
            </label>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm dark:border-neutral-800 dark:bg-black dark:text-neutral-200"
            />
          </div>
          <div className="sm:col-span-2">
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-300">
                Description
              </label>
              <button
                type="button"
                onClick={generateEventDescription}
                disabled={generatingDesc}
                className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-700 disabled:opacity-50 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-black dark:text-neutral-200 dark:hover:bg-neutral-900"
                title="Generate description with AI"
              >
                {generatingDesc ? "Generating..." : "💫AI Generate"}
              </button>
            </div>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm dark:border-neutral-800 dark:bg-black dark:text-neutral-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-300">
              District
            </label>
            <select
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm dark:border-neutral-800 dark:bg-black dark:text-neutral-200"
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
            <input
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm dark:border-neutral-800 dark:bg-black dark:text-neutral-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-300">
              Start Date
            </label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => set("startDate", e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm dark:border-neutral-800 dark:bg-black dark:text-neutral-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-300">
              End Date
            </label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => set("endDate", e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm dark:border-neutral-800 dark:bg-black dark:text-neutral-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-300">
              Time
            </label>
            <input
              placeholder="e.g., 19:00"
              value={form.time}
              onChange={(e) => set("time", e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm dark:border-neutral-800 dark:bg-black dark:text-neutral-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-300">
              Image URL
            </label>
            <div className="flex items-center gap-2">
              <input
                value={form.image}
                onChange={(e) => set("image", e.target.value)}
                placeholder="Paste image URL or use Browse"
                className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm dark:border-neutral-800 dark:bg-black dark:text-neutral-200"
              />

              <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-black dark:text-neutral-200 dark:hover:bg-neutral-900">
                {uploading ? "Uploading..." : "Browse"}
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    // allow picking the same file again
                    e.target.value = "";
                    onPickImage(f);
                  }}
                />
              </label>
            </div>

            {uploadError ? (
              <div className="mt-2 text-xs font-semibold text-rose-700 dark:text-rose-200">
                {uploadError}
              </div>
            ) : null}

            {imagePreview ? (
              <div className="mt-3 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
                <img
                  src={imagePreview}
                  alt="Event"
                  className="h-28 w-full object-cover"
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-neutral-200 px-4 py-2 text-sm dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900"
          >
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

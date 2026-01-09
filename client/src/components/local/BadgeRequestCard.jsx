import React, { useState } from "react";
import { createBadgeRequest } from "../../api1/badge";
import Reveal from "../motion/Reveal2";
import { useAuth } from "../../state/AuthContext";

export default function BadgeRequestCard() {
  const { user, refreshUser } = useAuth();
  const [urls, setUrls] = useState("");
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const badgeStatus = (user?.badgeStatus || "none").toString().toLowerCase();
  const isVerified = badgeStatus === "verified";
  const isPending = badgeStatus === "pending";

  const submit = async () => {
    if (isVerified) return;
    if (isPending) return;

    const document_urls = urls
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (document_urls.length === 0) {
      alert("Please add at least one document URL");
      return;
    }
    try {
      setSaving(true);
      await createBadgeRequest({ document_urls });
      setOk(true);
      setUrls("");
      await refreshUser?.();
    } catch (e) {
      alert(e.message || "Failed to submit");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Reveal className="mt-6 rounded-2xl border border-teal-200 bg-teal-50 p-4 text-teal-900 dark:border-teal-500/30 dark:bg-teal-500/10 dark:text-teal-100">
      <div className="text-sm font-semibold">Get verified</div>
      <p className="text-sm">
        Submit documents to receive a Verified badge. Paste public URLs
        separated by commas.
      </p>
      <div className="mt-2 flex gap-2">
        <input
          placeholder="https://... , https://..."
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          disabled={saving || isVerified || isPending}
          className="w-full rounded-xl border border-teal-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-400/40 dark:border-teal-500/30 dark:bg-black dark:text-neutral-200"
        />
        <button
          onClick={submit}
          disabled={saving || isVerified || isPending}
          className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving
            ? "Submitting..."
            : isVerified
            ? "Verified"
            : isPending
            ? "Pending"
            : "Submit"}
        </button>
      </div>
      {ok && (
        <div className="mt-2 text-xs text-teal-800 dark:text-teal-200">
          Submitted! We’ll review shortly.
        </div>
      )}
      {!ok && isPending && (
        <div className="mt-2 text-xs text-teal-800 dark:text-teal-200">
          Your request is pending review.
        </div>
      )}
      {!ok && isVerified && (
        <div className="mt-2 text-xs text-teal-800 dark:text-teal-200">
          You are verified.
        </div>
      )}
    </Reveal>
  );
}

import React, { useState } from "react";
import { createBadgeRequest } from "../../api1/badge";
import Reveal from "../motion/Reveal2";

export default function BadgeRequestCard({ userId }) {
  const [urls, setUrls] = useState("");
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);

  const submit = async () => {
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
      await createBadgeRequest({ user_id: userId, document_urls });
      setOk(true);
      setUrls("");
    } catch (e) {
      alert(e.message || "Failed to submit");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Reveal className="mt-6 rounded-2xl border border-teal-200 bg-teal-50 p-4 text-teal-900">
      <div className="text-sm font-semibold">Get verified</div>
      <p className="text-sm">
        Submit documents to receive a Verified badge. Paste public URLs separated by commas.
      </p>
      <div className="mt-2 flex gap-2">
        <input
          placeholder="https://... , https://..."
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          className="w-full rounded-xl border border-teal-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-400/40"
        />
        <button
          onClick={submit}
          disabled={saving}
          className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Submitting..." : "Submit"}
        </button>
      </div>
      {ok && <div className="mt-2 text-xs text-teal-800">Submitted! We’ll review shortly.</div>}
    </Reveal>
  );
}
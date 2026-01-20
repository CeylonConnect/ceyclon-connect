import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Avatar from "../components/ui/avatar";
import { useAuth } from "../state/AuthContext";
import http from "../lib/http";

export default function Account() {
  const { user, refreshUser, initializing, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initializing) return;
    if (!user) {
      const next = `${location.pathname}${location.search}`;
      navigate(`/login?next=${encodeURIComponent(next)}`, { replace: true });
    }
  }, [initializing, user, navigate, location.pathname, location.search]);

  
  if (initializing || !user) {
    return (
      <>
        <Navbar />
        <main className="bg-sand-50 dark:bg-black">
          <section className="mx-auto max-w-6xl px-4 py-16 text-center text-neutral-600 dark:text-neutral-300">
            {initializing ? "Loading..." : "Redirecting to login..."}
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-sand-50 dark:bg-black">
        <section className="mx-auto max-w-4xl px-4 py-8">
          <div className="flex items-center gap-4">
            <Avatar
              src={user.avatar}
              name={`${user.firstName || ""} ${user.lastName || ""}`.trim()}
              email={user.email}
              size={56}
              className="ring-2 ring-white shadow dark:ring-neutral-800"
            />
            <div>
              <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white">
                Manage account
              </h1>
              <p className="text-neutral-600 dark:text-neutral-300">
                Update your profile details.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-black">
            <h2 className="text-lg font-semibold text-neutral-800 dark:text-white">
              Profile
            </h2>
            <form
              className="mt-4 space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (saving) return;
                setError("");
                setSaving(true);
                try {
                  const fd = new FormData(e.currentTarget);
                  const payload = {
                    first_name: String(fd.get("firstName") || "").trim(),
                    last_name: String(fd.get("lastName") || "").trim(),
                    email: String(fd.get("email") || "").trim(),
                    phone: String(fd.get("phone") || "").trim(),
                  };

                  await http.put("/users/me", payload);
                  await refreshUser();
                  alert("Profile updated!");
                } catch (err) {
                  const msg =
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Failed to update profile";
                  setError(String(msg));
                } finally {
                  setSaving(false);
                }
              }}
            >
              {error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/30 dark:text-rose-200">
                  {error}
                </div>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    defaultValue={user.firstName}
                    disabled={saving}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400/40 dark:border-neutral-800 dark:bg-black dark:text-neutral-200"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    defaultValue={user.lastName}
                    disabled={saving}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400/40 dark:border-neutral-800 dark:bg-black dark:text-neutral-200"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={user.email}
                    disabled={saving}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400/40 dark:border-neutral-800 dark:bg-black dark:text-neutral-200"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    Phone
                  </label>
                  <input
                    name="phone"
                    defaultValue={user.phone}
                    disabled={saving}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400/40 dark:border-neutral-800 dark:bg-black dark:text-neutral-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={saving}
                  className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={() => logout()}
                  disabled={saving}
                  className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900"
                >
                  Logout
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}


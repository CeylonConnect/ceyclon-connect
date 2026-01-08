import React, { useEffect, useMemo, useState } from "react";
import {
  getAdminUsers,
  setAdminUserBlocked,
  unblockAllUsers,
} from "../../api/admin";

const cx = (...c) => c.filter(Boolean).join(" ");

export default function UsersPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const [actingId, setActingId] = useState(null);

  const load = async ({ keepLoading = false } = {}) => {
    if (!keepLoading) setLoading(true);
    setError("");
    try {
      const users = await getAdminUsers({ role, q });
      setItems(Array.isArray(users) ? users : []);
    } catch (e) {
      setItems([]);
      setError(e?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const rows = useMemo(() => {
    // If backend filtering is not used for q, this keeps search responsive.
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((u) => {
      const name = `${u.first_name || ""} ${u.last_name || ""}`.trim();
      return (
        name.toLowerCase().includes(s) ||
        String(u.email || "")
          .toLowerCase()
          .includes(s) ||
        String(u.phone || "")
          .toLowerCase()
          .includes(s)
      );
    });
  }, [items, q]);

  const toggleBlocked = async (u) => {
    const userId = u?.user_id;
    if (!userId) return;
    const isBlocked = !Number(u.is_verified);
    const nextBlocked = !isBlocked;

    const ok = confirm(
      nextBlocked
        ? `Block ${u.email || "this user"}? They may lose access.`
        : `Unblock ${u.email || "this user"}?`
    );
    if (!ok) return;

    try {
      setActingId(userId);
      const res = await setAdminUserBlocked(userId, nextBlocked);
      const updated = res?.user;

      setItems((prev) =>
        prev.map((x) => (x.user_id === userId ? { ...x, ...updated } : x))
      );
    } catch (e) {
      alert(e?.message || "Action failed");
    } finally {
      setActingId(null);
    }
  };

  const onUnblockAll = async () => {
    const ok = confirm("Unblock all users?");
    if (!ok) return;

    try {
      setLoading(true);
      await unblockAllUsers();
      await load({ keepLoading: true });
    } catch (e) {
      alert(e?.message || "Failed to unblock all users");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-black">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, email, phone..."
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-400/30 dark:border-neutral-800 dark:bg-black dark:text-neutral-200"
            />
            <button
              type="button"
              onClick={() => load()}
              className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900"
            >
              Search
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-black dark:text-neutral-200"
            >
              <option value="all">All</option>
              <option value="tourist">tourist</option>
              <option value="local">local</option>
              <option value="admin">admin</option>
            </select>
            <button
              type="button"
              onClick={() => {
                setQ("");
                load({ keepLoading: false });
              }}
              className="rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={onUnblockAll}
              className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:brightness-105"
            >
              Unblock All
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase tracking-wide text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Badge</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {loading && (
                <tr>
                  <td
                    className="px-4 py-6 text-neutral-600 dark:text-neutral-300"
                    colSpan={5}
                  >
                    Loading users...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td
                    className="px-4 py-6 text-rose-700 dark:text-rose-200"
                    colSpan={5}
                  >
                    {error}
                  </td>
                </tr>
              )}

              {!loading && !error && rows.length === 0 && (
                <tr>
                  <td
                    className="px-4 py-6 text-neutral-600 dark:text-neutral-300"
                    colSpan={5}
                  >
                    No users found.
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                rows.map((u) => {
                  const name =
                    `${u.first_name || ""} ${u.last_name || ""}`.trim() || "—";
                  const badge = (u.badge_status || "none")
                    .toString()
                    .toLowerCase();
                  const isBlocked = !Number(u.is_verified);
                  const canAct = actingId === null || actingId === u.user_id;

                  return (
                    <tr key={u.user_id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 overflow-hidden rounded-full bg-neutral-100 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
                            {u.profile_picture ? (
                              <img
                                src={u.profile_picture}
                                alt={name}
                                className="h-full w-full object-cover"
                              />
                            ) : null}
                          </div>
                          <div>
                            <div className="font-semibold text-neutral-900 dark:text-white">
                              {name}
                            </div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-300">
                              {u.email || "—"}
                            </div>
                            {u.phone && (
                              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                {u.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="rounded-full border border-neutral-200 bg-white px-2 py-1 text-xs font-semibold text-neutral-700 dark:border-neutral-800 dark:bg-black dark:text-neutral-200">
                          {u.role}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={cx(
                            "rounded-full px-2 py-1 text-xs font-semibold",
                            badge === "verified"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200"
                              : badge === "pending"
                              ? "bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200"
                              : "bg-neutral-100 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                          )}
                        >
                          {badge}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={cx(
                            "rounded-full px-2 py-1 text-xs font-semibold",
                            isBlocked
                              ? "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200"
                              : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200"
                          )}
                        >
                          {isBlocked ? "blocked" : "active"}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          disabled={!canAct}
                          onClick={() => toggleBlocked(u)}
                          className={cx(
                            "rounded-xl px-3 py-1.5 text-xs font-semibold",
                            isBlocked
                              ? "bg-emerald-600 text-white hover:brightness-105"
                              : "bg-rose-600 text-white hover:brightness-105",
                            !canAct && "opacity-60"
                          )}
                        >
                          {actingId === u.user_id
                            ? "Working..."
                            : isBlocked
                            ? "Unblock"
                            : "Block"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

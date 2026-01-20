import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminTopbar from "../components/admin/AdminTopbar";
import StatsHeader from "../components/admin/StatHeader";
import Tabs from "../components/admin/AdminTabs";
import UsersPanel from "../components/admin/UsersPanel";
import ToursPanel from "../components/admin/ToursPanel";
import BadgeRequestsPanel from "../components/admin/BadgeRequestPanel";
import DisputesPanel from "../components/admin/DisputesPanel";
import EventsPanel from "../components/admin/EventsPanel";
import { useAuth } from "../state/AuthContext";

export default function AdminDashboard() {
  const { user, initializing } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const role = (user?.role || "").toString().toLowerCase();

  
  const [tab, setTab] = useState("badge");

  // Allow deep-linking into a tab (e.g. /admin?tab=disputes)
  useEffect(() => {
    const t = new URLSearchParams(location.search).get("tab");
    const allowed = new Set(["users", "tours", "badge", "disputes", "events"]);
    if (t && allowed.has(String(t).toLowerCase())) {
      setTab(String(t).toLowerCase());
    }
  }, [location.search]);

  useEffect(() => {
    if (initializing) return;
    if (!user) {
      const next = `${location.pathname}${location.search}`;
      navigate(`/login?next=${encodeURIComponent(next)}`, { replace: true });
      return;
    }
    if (role && role !== "admin") {
      if (role === "local" || role === "guide") {
        navigate("/local", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [initializing, user, role, navigate, location.pathname, location.search]);

  if (initializing) return null;
  if (!user) return null;
  if (role !== "admin") return null;

  const items = [
    { value: "users", label: "Users" },
    { value: "tours", label: "Tours" },
    { value: "badge", label: "Badge Requests" },
    { value: "disputes", label: "Disputes" },
    { value: "events", label: "Events" },
  ];

  return (
    <main className="min-h-screen bg-sand-50 dark:bg-black">
      <AdminTopbar />
      <StatsHeader />

      <section className="mx-auto mt-6 max-w-7xl px-4">
        <Tabs value={tab} onChange={setTab} items={items} />

        {tab === "users" && <UsersPanel />}
        {tab === "tours" && <ToursPanel />}
        {tab === "badge" && <BadgeRequestsPanel />}
        {tab === "disputes" && <DisputesPanel />}
        {tab === "events" && <EventsPanel />}
      </section>
    </main>
  );
}

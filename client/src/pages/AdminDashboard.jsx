import React, { useState } from "react";
import AdminTopbar from "../components/admin/AdminTopbar";
import StatsHeader from "../components/admin/StatHeader";
import Tabs from "../components/admin/AdminTabs";
import UsersPanel from "../components/admin/UsersPanel";
import ToursPanel from "../components/admin/ToursPanel";
import BadgeRequestsPanel from "../components/admin/BadgeRequestPanel";
import DisputesPanel from "../components/admin/DisputesPanel";
import EventsPanel from "../components/admin/EventsPanel";

export default function AdminDashboard() {
  const [tab, setTab] = useState("badge");

  const items = [
    { value: "users", label: "Users" },
    { value: "tours", label: "Tours" },
    { value: "badge", label: "Badge Requests" },
    { value: "disputes", label: "Disputes" },
    { value: "events", label: "Events" },
  ];

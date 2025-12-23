import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import AIAssistant from "./AIAssistant";
import { LayoutDashboard, User, LogOut, Bell } from "lucide-react";
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
} from "../api/notifications";

const NavLink = ({ children, to = "#", onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="px-3 py-2 text-[15px] font-medium text-neutral-700 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-white transition-colors"
  >
    {children}
  </Link>
);

const SunIcon = ({ className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="M4.93 4.93l1.41 1.41" />
    <path d="M17.66 17.66l1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="M4.93 19.07l1.41-1.41" />
    <path d="M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = ({ className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12.8A8.5 8.5 0 0 1 11.2 3a7 7 0 1 0 9.8 9.8Z" />
  </svg>
);

export default function Navbar({
  isAuthenticated: isAuthenticatedProp,
  onLoginClick,
  onSignupClick,
  onDashboardClick,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [elevated, setElevated] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const profileRef = useRef(null);
  const notifRefDesktop = useRef(null);
  const notifRefMobile = useRef(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const onProfileMouseLeave = (e) => {
    const el = profileRef.current;
    const nextTarget = e?.relatedTarget;
    if (el && nextTarget && el.contains(nextTarget)) return;
    setProfileOpen(false);
  };

  const tokenExists =
    typeof window !== "undefined" &&
    (localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("token"));

  // Some pages historically pass isAuthenticated={false}. After login/logout we want
  // the navbar to reflect the real auth state, so we never let a false prop override.
  const isAuthenticated =
    Boolean(user || tokenExists) || isAuthenticatedProp === true;

  const dashboardPath = useMemo(() => {
    const role = (user?.role || "tourist").toString().toLowerCase();
    if (role === "admin") return "/admin";
    if (role === "local" || role === "guide") return "/local";
    return "/dashboard";
  }, [user?.role]);

 useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("theme");
    const next = saved === "dark" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }, []);

  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("theme", next);
      } catch {
        // ignore
      }
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", next === "dark");
      }
      return next;
    });
  };

  const goToLogin = () => {
    const next = `${location.pathname}${location.search}`;
    setOpen(false);
    if (onLoginClick) return onLoginClick();
    navigate(`/login?next=${encodeURIComponent(next)}`);
  };

  const goToSignup = () => {
    const next = `${location.pathname}${location.search}`;
    setOpen(false);
    if (onSignupClick) return onSignupClick();
    navigate(`/signup?next=${encodeURIComponent(next)}`);
  };

  const goToDashboard = () => {
    setOpen(false);
    // Always respect role-based dashboard routing when authenticated.
    // Some pages still pass onDashboardClick={() => "/dashboard"}, which would break locals.
    navigate(dashboardPath);
  };

  const onLogoutClick = () => {
    setOpen(false);
    setProfileOpen(false);
    if (typeof logout === "function") return logout();
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const toggleAi = () => {
    setAiOpen((s) => !s);
    setProfileOpen(false);
    setNotifOpen(false);
    setOpen(false);
  };

  const loadUnread = async () => {
    try {
      const res = await getUnreadNotificationCount();
      setUnreadCount(Number(res?.unread_count || 0));
    } catch {
      // ignore
    }
  };

  const loadList = async () => {
    try {
      const list = await getNotifications({ limit: 10, offset: 0 });
      setNotifications(Array.isArray(list) ? list : []);
    } catch {
      setNotifications([]);
    }
  };

  const openNotifications = async () => {
    setNotifOpen(true);
    setProfileOpen(false);
    setAiOpen(false);
    setOpen(false);
    await loadList();
    try {
      await markAllNotificationsRead();
    } catch {
      // ignore
    }
    // Optimistically update local state
    setNotifications((prev) =>
      (Array.isArray(prev) ? prev : []).map((n) => ({ ...n, is_read: true }))
    );
    setUnreadCount(0);
  };

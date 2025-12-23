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

const toggleNotifications = () => {
    if (notifOpen) {
      setNotifOpen(false);
      return;
    }
    openNotifications();
  };

  const goToAccount = () => {
    setOpen(false);
    setAiOpen(false);
    setProfileOpen(false);
    navigate("/account");
  };

  useEffect(() => {
    const onDocDown = (e) => {
      const el = profileRef.current;
      if (!el) return;
      if (profileOpen && !el.contains(e.target)) setProfileOpen(false);

      const inNotif =
        (notifRefDesktop.current && notifRefDesktop.current.contains(e.target)) ||
        (notifRefMobile.current && notifRefMobile.current.contains(e.target));
      if (notifOpen && !inNotif) setNotifOpen(false);
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [profileOpen, notifOpen]);

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      setNotifications([]);
      return;
    }
    loadUnread();

    const interval = window.setInterval(() => {
      loadUnread();
    }, 15000);

    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.user_id, user?.id]);

  return (
    <header
      className={`sticky top-0 z-50 w-full ${
        elevated
          ? "bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-md shadow-black/5 ring-1 ring-black/5 dark:bg-black/85 dark:supports-[backdrop-filter]:bg-black/70 dark:shadow-black/20 dark:ring-white/10"
          : "bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-black/80 dark:supports-[backdrop-filter]:bg-black/60 dark:ring-1 dark:ring-white/10"
      }`}
    >
      <div className="mx-auto mr-14 ml-14 max-w-full px-1">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link
            to="/"
            className="text-xl sm:text-3xl font-extrabold mb-4 sm:mb-2 select-none 
bg-gradient-to-r from-orange-600 via-yellow-500 to-teal-600 
bg-clip-text text-transparent"
          >
            CeyloneConnect
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* {isAuthenticated ? (
              <NavLink to={dashboardPath}>Dashboard</NavLink>
            ) : null} */}
            <NavLink to="/tours">Discover Tours</NavLink>
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-5">
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={toggleTheme}
                  role="switch"
                  aria-checked={theme === "dark"}
                  title={
                    theme === "dark"
                      ? "Switch to light mode"
                      : "Switch to dark mode"
                  }
                  className={`relative inline-flex h-9 w-14 items-center rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40 dark:focus-visible:ring-orange-300/30 ${
                    theme === "dark"
                      ? "border-neutral-800 bg-neutral-900"
                      : "border-neutral-200 bg-neutral-100"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute left-2 z-10 transition-opacity ${
                      theme === "dark" ? "opacity-100" : "opacity-100"
                    }`}
                  >
                    <SunIcon className="h-4 w-4 text-yellow-500 dark:text-yellow-500" />
                  </span>
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute right-1 bottom-1 z-10 transition-opacity ${
                      theme === "dark" ? "opacity-100" : "opacity-100"
                    }`}
                  >
                    <MoonIcon className="h-6 w-5 text-sky-500 dark:text-sky-300" />
                  </span>
                  <span
                    aria-hidden="true"
                    className={`absolute left-1 top-1 z-20 h-7 w-7 transform rounded-full bg-white shadow-sm transition-transform dark:bg-neutral-100 ${
                      theme === "dark" ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>

                    <div className="relative">
                  <button
                    type="button"
                    onClick={toggleAi}
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-black dark:text-neutral-200 dark:hover:bg-neutral-900"
                    title="Open AI Assistant"
                  >
                    🤖 Assistant
                  </button>

                  <AIAssistant
                    open={aiOpen}
                    onClose={() => setAiOpen(false)}
                    variant="popover"
                  />
                </div>

                <div ref={notifRefDesktop} className="relative">
                  <button
                    type="button"
                    onClick={toggleNotifications}
                    className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-black dark:text-neutral-200 dark:hover:bg-neutral-900"
                    title="Notifications"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 ? (
                      <span className="absolute -right-1 -top-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-rose-600 px-1 text-[11px] font-bold text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    ) : null}
                  </button>

                  {notifOpen ? (
                    <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-black">
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="text-sm font-bold text-neutral-900 dark:text-white">
                          Notifications
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setNotifOpen(false);
                            loadUnread();
                          }}
                          className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                        >
                          Close
                        </button>
                      </div>

                      <div className="max-h-80 overflow-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 pb-4 text-sm text-neutral-600 dark:text-neutral-300">
                            No notifications.
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <button
                              key={n.notification_id}
                              type="button"
                              onClick={() => {
                                const href = n.link || dashboardPath;
                                setNotifOpen(false);
                                navigate(href);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-900"
                            >
                              <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                                {n.title}
                              </div>
                              {n.message ? (
                                <div className="mt-0.5 text-xs text-neutral-600 dark:text-neutral-300">
                                  {n.message}
                                </div>
                              ) : null}
                              <div className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                                {n.created_at ? String(n.created_at).replace("T", " ") : ""}
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>

                 {/* <button
                  onClick={goToDashboard}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-neutral-700 hover:text-white hover:bg-green-500 hover:transition dark:text-neutral-200"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z"
                      fill="currentColor"
                    />
                  </svg>
                  Dashboard
                </button> */}

                <div
                  ref={profileRef}
                  className="relative"
                  onMouseEnter={() => setProfileOpen(true)}
                  onMouseLeave={onProfileMouseLeave}
                >
                  <button
                    type="button"
                    onClick={() => setProfileOpen((s) => !s)}
                    className="grid h-10 w-10 place-items-center rounded-full bg-white ring-2 ring-green-500 ring-offset-2 ring-offset-white hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 dark:bg-black dark:ring-offset-black"
                    title="Account"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                        {String(user?.firstName || user?.email || "U")
                          .trim()
                          .slice(0, 1)
                          .toUpperCase()}
                      </div>
                    )}
                  </button>

                  {profileOpen ? (
                    <div className="absolute right-0 top-full mt-0 w-52 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-black">
                      <button
                        type="button"
                        onClick={goToDashboard}
                        className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm font-semibold text-neutral-800 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-neutral-700"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </button>

                      <button
                        type="button"
                        onClick={goToAccount}
                        className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm font-semibold text-neutral-800 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-neutral-700"
                      >
                        <User className="h-4 w-4" />
                        Manage account
                      </button>

                      <button
                        type="button"
                        onClick={onLogoutClick}
                        className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm font-semibold text-rose-700 hover:bg-rose-300 dark:hover:bg-rose-700/30"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  ) : null}
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={toggleTheme}
                  role="switch"
                  aria-checked={theme === "dark"}
                  title={
                    theme === "dark"
                      ? "Switch to light mode"
                      : "Switch to dark mode"
                  }
                  className={`relative inline-flex h-9 w-14 items-center rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40 dark:focus-visible:ring-orange-300/30 ${
                    theme === "dark"
                      ? "border-neutral-800 bg-neutral-900"
                      : "border-neutral-200 bg-neutral-100"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute left-2 z-10 transition-opacity ${
                      theme === "dark" ? "opacity-100" : "opacity-100"
                    }`}
                  >
                    <SunIcon className="h-4 w-4 text-yellow-500" />
                  </span>
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute right-1 bottom-1 z-10 transition-opacity ${
                      theme === "dark" ? "opacity-100" : "opacity-100"
                    }`}
                  >
                    <MoonIcon className="h-6 w-5 text-sky-500 dark:text-sky-300" />
                  </span>
                  <span
                    aria-hidden="true"
                    className={`absolute left-1 top-1 z-20 h-7 w-7 transform rounded-full bg-white shadow-sm transition-transform dark:bg-neutral-100 ${
                      theme === "dark" ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={toggleAi}
                    className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-black dark:text-neutral-200 dark:hover:bg-neutral-900"
                    title="Open AI Assistant"
                  >
                    🤖 Assistant
                  </button>

                  <AIAssistant
                    open={aiOpen}
                    onClose={() => setAiOpen(false)}
                    variant="popover"
                  />
                </div>
                <button
                  onClick={goToLogin}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-neutral-700 hover:text-white hover:bg-blue-500 transition dark:text-neutral-200"
                >
                  Login
                </button>
                <button
                  onClick={goToSignup}
                  className="rounded-xl bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-105 active:scale-95 transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile actions */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={toggleAi}
              className="inline-flex h-10 items-center justify-center rounded-md px-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 transition dark:text-neutral-200 dark:hover:bg-neutral-900"
              aria-label="Open AI Assistant"
              title="AI Assistant"
            >
              <span aria-hidden="true">🤖</span>
              <span className="ml-2 hidden sm:inline">Assistant</span>
            </button>

            {isAuthenticated ? (
              <div ref={notifRefMobile} className="relative">
                <button
                  type="button"
                  onClick={toggleNotifications}
                  className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-100 transition dark:text-neutral-200 dark:hover:bg-neutral-900"
                  aria-label="Notifications"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 ? (
                    <span className="absolute -right-1 -top-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-rose-600 px-1 text-[11px] font-bold text-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  ) : null}
                </button>

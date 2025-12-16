import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../state/AuthContext";
import { useNavigate } from "react-router-dom";

const NavLink = ({ children, href = "#" }) => (
  <a
    href={href}
    className="px-3 py-2 text-[15px] font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
  >
    {children}
  </a>
);

export default function Navbar({
  onLoginClick,
  onSignupClick,
  onDashboardClick,
}) {
  const [open, setOpen] = useState(false);
  const [elevated, setElevated] = useState(false);
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onLogoutClick = () => {
    logout();
  };

  const handleLogin = () => {
    if (onLoginClick) return onLoginClick();
    navigate("/login");
  };

  const handleSignup = () => {
    if (onSignupClick) return onSignupClick();
    navigate("/signup");
  };

  const handleDashboard = () => {
    if (onDashboardClick) return onDashboardClick();
    const dest =
      user && (user.role === "local" || user.role === "guide")
        ? "/local"
        : "/dashboard";
    navigate(dest);
  };

return (
    <header
      className={`sticky top-0 z-50 w-full ${
        elevated
          ? "bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-md shadow-black/5 ring-1 ring-black/5"
          : "bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60"
      }`}
    >
      <div className="mx-auto mr-14 ml-14 max-w-full px-1">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <a
            href="/"
            className="text-xl sm:text-3xl font-extrabold mb-4 sm:mb-2 select-none 
bg-gradient-to-r from-orange-600 via-yellow-500 to-teal-600 
bg-clip-text text-transparent"
          >
            CeyloneConnect
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink href="/tours">Discover Tours</NavLink>
            <NavLink href="/events">Events</NavLink>
            <NavLink href="/about">About</NavLink>
          </nav>

     {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleDashboard}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-neutral-700 hover:text-white hover:bg-green-500 hover:transition"
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
                </button>
                <button
                  onClick={onLogoutClick}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-neutral-700 hover:text-white hover:bg-red-500 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-neutral-700 hover:text-white hover:bg-blue-500 transition"
                >
                  Login
                </button>
                <button
                  onClick={handleSignup}
                  className="rounded-xl bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-105 active:scale-95 transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

             {/* Mobile burger */}
          <button
            className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-neutral-700 hover:bg-neutral-100 transition"
            onClick={() => setOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            <svg
              className={`transition-transform ${open ? "rotate-90" : ""}`}
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
            >
              {open ? (
                <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 pb-4">
          <nav className="flex flex-col gap-1 rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm">
            <a
              href="/tours"
              className="rounded-lg px-3 py-2 text-neutral-700 hover:bg-neutral-50"
            >
              Discover Tours
            </a>
            <a
              href="/events"
              className="rounded-lg px-3 py-2 text-neutral-700 hover:bg-neutral-50"
            >
              Events
            </a>
            <a
              href="/about"
              className="rounded-lg px-3 py-2 text-neutral-700 hover:bg-neutral-50"
            >
              About
            </a>
            <div className="mt-1 grid grid-cols-2 gap-2">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={handleDashboard}
                    className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={onLogoutClick}
                    className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:brightness-105"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLogin}
                    className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleSignup}
                    className="rounded-lg bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

Navbar.propTypes = {
  onLoginClick: PropTypes.func,
  onSignupClick: PropTypes.func,
  onDashboardClick: PropTypes.func,
};

NavLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string,
};


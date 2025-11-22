import React, { useEffect, useState } from "react";
import { useAuth } from "../state/AuthContext";
import { useNavigate } from "react-router-dom";

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


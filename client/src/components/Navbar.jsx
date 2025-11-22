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

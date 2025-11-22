import React from "react";

// Reusable link item with gradient hover + subtle rise animation
function FooterLink({ href = "#", children, external = false }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="footer-link relative inline-flex items-center text-[15px] text-neutral-600 transition 
                 will-change-transform group"
    >
      <span
        className="relative z-10 bg-clip-text group-hover:text-transparent group-hover:animate-none
                   group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:via-orange-400 group-hover:to-teal-500
                   transition-colors duration-300"
      >
        {children}
      </span>
      {/* underline / slide glow */}
      <span
        className="absolute inset-x-0 -bottom-0.5 h-px scale-x-0 bg-gradient-to-r from-orange-500 via-yellow-400 to-teal-500
                       origin-left transition-transform duration-300 group-hover:scale-x-100"
      ></span>
    </a>
  );
}

function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="group inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-600 
                 transition-transform duration-300 transform hover:scale-150 hover:text-orange-600"
    >
      <span className="relative">{children}</span>
    </a>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-sand-50 border-t border-neutral-200/70">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-12 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <a
                href="/"
                className="text-xl sm:text-2xl font-extrabold mb-4 sm:mb-2 select-none 
bg-gradient-to-r from-orange-600 via-yellow-500 to-teal-600 
bg-clip-text text-transparent"
              >
                CeyloneConnect
              </a>
            </div>
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-neutral-600">
              Connecting travelers with authentic Sri Lankan experiences through
              local guides.
            </p>
            <div className="mt-6 flex gap-3">
              <SocialIcon href="#" label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M13 10h4V7h-4V5a1 1 0 0 1 1-1h3V1h-3a4 4 0 0 0-4 4v2H8v3h3v11h2V10Z"
                    fill="currentColor"
                  />
                </svg>
              </SocialIcon>
              <SocialIcon href="#" label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle cx="17" cy="7" r="1" fill="currentColor" />
                </svg>
              </SocialIcon>
              <SocialIcon href="#" label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 5.8c-.7.3-1.5.6-2.3.7.8-.5 1.4-1.3 1.7-2.3-.7.5-1.7.9-2.6 1.1A3.9 3.9 0 0 0 12 8.7c0 .3 0 .6.1.9A11 11 0 0 1 3 5.2a4 4 0 0 0 1.2 5.3 3.8 3.8 0 0 1-1.8-.5v.1a3.9 3.9 0 0 0 3.1 3.8 4 4 0 0 1-1.8.1 3.9 3.9 0 0 0 3.6 2.6A7.9 7.9 0 0 1 2 19.5a11.2 11.2 0 0 0 6 1.8c7.2 0 11.2-6 11.2-11.2v-.5c.8-.6 1.4-1.3 1.8-2.1Z"
                    fill="currentColor"
                  />
                </svg>
              </SocialIcon>
            </div>
          </div>

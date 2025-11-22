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

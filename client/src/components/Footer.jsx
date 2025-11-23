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

          {/* Explore */}
          <div>
            <h4 className="text-lg font-semibold text-neutral-800">Explore</h4>
            <ul className="mt-5 space-y-3">
              <li>
                <FooterLink href="/tours">Browse Tours</FooterLink>
              </li>
              <li>
                <FooterLink href="/events">Upcoming Events</FooterLink>
              </li>
              <li>
                <FooterLink href="/guides">Find Guides</FooterLink>
              </li>
              <li>
                <FooterLink href="/destinations">Destinations</FooterLink>
              </li>
            </ul>
          </div>

          {/* For Guides */}
          <div>
            <h4 className="text-lg font-semibold text-neutral-800">
              For Guides
            </h4>
            <ul className="mt-5 space-y-3">
              <li>
                <FooterLink href="/become-a-guide">Become a Guide</FooterLink>
              </li>
              <li>
                <FooterLink href="/guide-resources">Resources</FooterLink>
              </li>
              <li>
                <FooterLink href="/verify">Get Verified</FooterLink>
              </li>
              <li>
                <FooterLink href="/community">Community</FooterLink>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-neutral-800">Support</h4>
            <ul className="mt-5 space-y-3">
              <li>
                <FooterLink href="mailto:support@ceylonconnect.lk" external>
                  <span className="mr-2 inline-flex">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4 4h16v16H4V4Zm0 0 8 8 8-8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  support@ceylonconnect.lk
                </FooterLink>
              </li>
              <li>
                <FooterLink href="tel:+94112345678" external>
                  <span className="mr-2 inline-flex">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6.5 3h-2A1.5 1.5 0 0 0 3 4.5 16.5 16.5 0 0 0 19.5 21 1.5 1.5 0 0 0 21 19.5v-2a1.5 1.5 0 0 0-1.5-1.5c-.9 0-1.8-.15-2.6-.45a1.5 1.5 0 0 0-1.46.33l-1.73 1.43a14 14 0 0 1-6.43-6.43l1.43-1.73a1.5 1.5 0 0 0 .33-1.46 8.5 8.5 0 0 1-.45-2.6A1.5 1.5 0 0 0 6.5 3Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  +94 764630969
                </FooterLink>
              </li>
              <li>
                <FooterLink href="/help">Help Center</FooterLink>
              </li>
              <li>
                <FooterLink href="/safety">Safety</FooterLink>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-10 border-neutral-200" />

        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-sm text-neutral-600">
            © {year} CeylonConnect. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
            <FooterLink href="/terms">Terms of Service</FooterLink>
            <FooterLink href="/cookies">Cookie Policy</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

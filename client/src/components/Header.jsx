import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";

export default function Header({ hidden, hideNavLinks = false, middleContent = null }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate();

  // Smooth scroll to section
  const scrollToSection = (e, selector) => {
    e.preventDefault()
    const target = document.querySelector(selector)
    if (target) {
      const headerHeight = document.querySelector('.header')?.offsetHeight || 0
      const offsetTop = target.offsetTop - headerHeight
      window.scrollTo({ top: offsetTop, behavior: 'smooth' })
    }
    setMenuOpen(false)
  }

  // Navigation links data (so we don’t repeat code)
  const navLinks = [
    { name: 'Tours', id: '#tours' },
    { name: 'Local Guides', id: '#guides' },
    { name: 'About', id: '#features' },
    { name: 'Contact', id: '#footer' },
  ]

   const handleBecomeGuide = () => {
    alert('Redirecting to guide registration...')
  }

  return (
    <header className={`header ${hidden ? 'header--hidden' : ''}`}>
      <div className="container">
        <div className="header-content">

          {/* Logo */}
          <div className="logo">
            <div className="logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <span className="logo-text">CeylonConnect</span>
          </div>

          {/* Desktop Navigation or custom middle content (for specific pages) */}
          {hideNavLinks ? (
            middleContent ? (
              <div className="nav-desktop">
                {middleContent}
              </div>
            ) : null
          ) : (
            <nav className="nav-desktop">
              {navLinks.map(link => (
                <a
                  key={link.id}
                  href={link.id}
                  className="nav-link"
                  onClick={(e) => scrollToSection(e, link.id)}
                >
                  {link.name}
                </a>
              ))}
            </nav>
          )}

          {/* Header Actions */}
          <div className="header-actions">
            <button className="btn btn-outline btn-sm" onClick={() => navigate("/login")}>Sign In</button>
            <button
              className="btn btn-hero btn-sm"
              onClick={handleBecomeGuide}
            >
              Become a Guide
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {!menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" x2="20" y1="6" y2="6"/>
                <line x1="4" x2="20" y1="12" y2="12"/>
                <line x1="4" x2="20" y1="18" y2="18"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m18 6-12 12"/>
                <path d="m6 6 12 12"/>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`mobile-menu ${menuOpen ? '' : 'hidden'}`}>
          <nav className="mobile-nav">
            {!hideNavLinks && navLinks.map(link => (
              <a
                key={link.id}
                href={link.id}
                className="mobile-nav-link"
                onClick={(e) => scrollToSection(e, link.id)}
              >
                {link.name}
              </a>
            ))}

            <div className="mobile-actions">
              <button onClick={() => navigate("/login")} className="btn btn-outline btn-sm">Sign In</button>
              <button
                className="btn btn-hero btn-sm"
                onClick={handleBecomeGuide}
              >
                Become a Guide
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

import React, { useEffect } from 'react'
import { assets } from '../assets/assets'

function GuideCard({ guide }) {
  // Animation on scroll
  useEffect(() => {
    const element = document.getElementById(`guide-${guide.id}`)
    if (!element) return

    element.classList.add('animate-init')

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('animate-in')
      })
    }, { threshold: 0.15 })

    observer.observe(element)
    return () => observer.disconnect()
  }, [guide.id])

  const handleViewProfile = () => {
    alert(`Viewing profile for: ${guide.name}\n\nYou would be redirected to the guide's profile page.`)
  }

  return (
    <div id={`guide-${guide.id}`} className="guide-card">
      <div className="guide-content">

        {/* Guide Header */}
        <div className="guide-header">
          <div className="guide-avatar-large">{guide.initials}</div>
          <div className="guide-basic-info">
            <div className="guide-name">
              {guide.name}
              <svg
                className="verified-badge"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 12l2 2 4-4" />
                <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h9l4-4h5z" />
              </svg>
            </div>
            <p className="guide-specialty">{guide.specialty}</p>
            <div className="guide-location">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {guide.location}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="guide-description">{guide.description}</p>

        {/* Stats */}
        <div className="guide-stats">
          <div className="guide-stat">
            <svg
              className="star-filled"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
            <span className="stat-value">{guide.rating}</span>
            <span className="stat-label">({guide.ratingCount})</span>
          </div>

          <div className="guide-stat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M3 12h9l4-4 4 4h1" />
            </svg>
            <span className="stat-value">{guide.tours}</span>
            <span className="stat-label">tours</span>
          </div>
        </div>

        {/* Languages */}
        <div className="guide-languages">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <div className="language-tags">
            {guide.languages.map((lang, index) => (
              <span key={index} className="language-tag">{lang}</span>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="guide-badges">
          {guide.badges.map((badge, index) => (
            <span key={index} className="guide-badge">{badge}</span>
          ))}
        </div>

        {/* View Profile Button */}
        <button className="btn btn-hero btn-full" onClick={handleViewProfile}>
          View Profile
        </button>
      </div>
    </div>
  )
}

export default function Guides({ guides }) {
  const handleBecomeGuide = () => {
    alert('Redirecting to guide registration...')
  }

  return (
    <section id="guides" className="guides">
      <div className="container">

        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">
            Meet Our <span className="gradient-text">Local Experts</span>
          </h2>
          <p className="section-subtitle">
            Our verified guides are passionate locals who love sharing their knowledge and hidden gems with travelers.
          </p>
        </div>

        {/* CTA Banner */}
        <div className="guide-cta-banner">
          <img
            src={assets.guide}
            alt="Diverse group of Sri Lankan local guides"
            className="cta-bg-image"
          />
          <div className="cta-overlay">
            <div className="cta-content">
              <h3 className="cta-title">Join 500+ Verified Guides</h3>
              <p className="cta-description">
                Share your local knowledge, earn income, and help travelers discover the real Sri Lanka.
              </p>
              <button className="btn btn-hero btn-lg" onClick={handleBecomeGuide}>
                Become a Guide
              </button>
            </div>
          </div>
        </div>

        {/* Guides Grid */}
        <div className="guides-grid">
          {guides.map(guide => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      </div>
    </section>
  )
}

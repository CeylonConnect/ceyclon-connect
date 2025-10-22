import React from 'react'
import { assets } from '../assets/assets'

export default function Hero({ searchTerm, setSearchTerm, onSearch }) {
  // Handle Enter key for search
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSearch()
  }

  return (
    <section className="hero">
      {/* Background Image with Overlay */}
      <div className="hero-bg">
        <img
          src={assets.hero}
          alt="Beautiful Sri Lankan landscape with temples and mountains"
          className="hero-image"
        />
        <div className="hero-overlay"></div>
      </div>

      {/* Main Hero Content */}
      <div className="container hero-content">

        {/* Hero Text */}
        <div className="hero-text">
          <h1 className="hero-title">
            Discover Sri Lanka with{' '}
            <span className="gradient-text">Authentic Locals</span>
          </h1>
          <p className="hero-subtitle">
            Connect with verified local guides and explore hidden gems,
            cultural treasures, and authentic experiences that only locals can share.
          </p>
        </div>

        {/* Search Bar */}
        <div className="search-card">
          <div className="search-container">
            <div className="search-input-container">
              {/* Location Icon */}
              <svg
                className="search-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>

              {/* Input Field */}
              <input
                type="text"
                placeholder="Where do you want to explore?"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Search Button */}
            <button className="btn btn-hero btn-lg" onClick={onSearch}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Find Tours
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-grid">

          <div className="stat-card">
            <div className="stat-content">
              <svg
                className="stat-icon stat-icon-saffron"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="m22 21-3-3" />
              </svg>
              <span className="stat-number">500+</span>
            </div>
            <p className="stat-label">Verified Guides</p>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <svg
                className="stat-icon stat-icon-green"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="stat-number">1000+</span>
            </div>
            <p className="stat-label">Unique Tours</p>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <svg
                className="stat-icon stat-icon-gold"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
              <span className="stat-number">4.9</span>
            </div>
            <p className="stat-label">Average Rating</p>
          </div>

        </div>
      </div>
    </section>
  )
}

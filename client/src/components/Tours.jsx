import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Single Tour Card component
function TourCard({ tour }) {
  // Handle booking button
  const onBook = () => {
    alert(`Booking initiated for: ${tour.title}\nPrice: ${tour.price}\n\nYou will be redirected to the booking page.`)
  }

  // Animate tour cards when they appear in viewport
  useEffect(() => {
    const element = document.getElementById(`tour-${tour.id}`)
    if (!element) return

    element.classList.add('animate-init')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('animate-in')
        })
      },
      { threshold: 0.15 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [tour.id])

  return (
    <div id={`tour-${tour.id}`} className="tour-card">
      {/* Tour Image */}
      <div className="tour-image-container">
        <img src={tour.image} alt={tour.title} className="tour-image" />
        <div className="tour-category">{tour.category}</div>
        <div className="tour-price">{tour.price}</div>
      </div>

      {/* Tour Content */}
      <div className="tour-content">
        <div className="tour-header">
          <h3 className="tour-title">{tour.title}</h3>
          <div className="tour-location">
            {/* Location icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {tour.location}
          </div>
        </div>

        {/* Description */}
        <p className="tour-description">{tour.description}</p>

        {/* Duration and Capacity */}
        <div className="tour-details">
          <div className="tour-detail">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
            {tour.duration}
          </div>

          <div className="tour-detail">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="m22 21-3-3" />
            </svg>
            {tour.capacity}
          </div>
        </div>

        {/* Rating */}
        <div className="tour-rating">
          <div className="rating">
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
            <span className="rating-value">{tour.rating}</span>
          </div>
          <span className="review-count">({tour.reviews} reviews)</span>
        </div>

        {/* Guide Information */}
        <div className="tour-guide">
          <div className="guide-avatar">{tour.guide.initials}</div>
          <div className="guide-info">
            <div className="guide-name">
              {tour.guide.name}
              <svg
                className="verified-badge"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 12l2 2 4-4" />
                <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h9l4-4h5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Button */}
      <div className="tour-footer">
        <button className="btn btn-hero btn-full" onClick={onBook}>
          Book Now
        </button>
      </div>
    </div>
  )
}

// All Tours Section
export default function Tours({ tours, loading, title = 'Popular', showViewAll = true }) {
  const navigate = useNavigate()
  return (
    <section className="tours">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">
            {title} <span className="gradient-text">Tours</span>
          </h2>
          <p className="section-subtitle">
            Discover our most loved experiences handpicked by travelers and curated by trusted local guides.
          </p>
        </div>

        {/* Tours Grid */}
        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading tours…</p>
        ) : (
          <div className="tours-grid">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}

        {/* Section Footer */}
        {showViewAll && (
          <div className="section-footer">
            <button
              className="btn btn-outline btn-lg"
              onClick={() => navigate('/tours')}
            >
              View All Tours
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from "../components/Header.jsx"
import Footer from "../components/Footer.jsx"
import { fetchTours } from "../services/api.js"
import '../style.css'
import '../styles/tourview.css'

export default function TourView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      const data = await fetchTours()
      if (mounted) {
        setTours(data || [])
        setLoading(false)
        window.scrollTo({ top: 0 })
      }
    })()
    return () => { mounted = false }
  }, [])

  const tour = useMemo(() => {
    const targetId = Number(id)
    return tours.find(t => Number(t.id) === targetId)
  }, [id, tours])

  const middle = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-outline btn-sm"
        aria-label="Go back"
        title="Go back"
      >
        ← Back
      </button>
      <h3 style={{ margin: 0 }}>{tour?.title || (loading ? 'Loading…' : 'Tour details')}</h3>
    </div>
  )

  if (!loading && !tour) {
    return (
      <>
        <Header hideNavLinks middleContent={middle} />
        <main>
          <section className="tour-view">
            <div className="container" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
              <div className="not-found">
                <p>We couldn't find this tour.</p>
                <button className="btn btn-outline" onClick={() => navigate('/tours')}>
                  Back to all tours
                </button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header hideNavLinks middleContent={middle} />
      <main>
        <section className="tour-view">
          <div className="container" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
            {loading ? (
              <div className="loading-state">
                <p>Loading tour…</p>
              </div>
            ) : (
              tour && (
                <div className="tour-view-grid">
                  {/* Image */}
                  <div className="tour-view-image">
                    <img src={tour.image} alt={tour.title} />
                    <div className="badge">{tour.category}</div>
                  </div>

                  {/* Content */}
                  <div className="tour-view-content">
                    <h1 className="tour-title">{tour.title}</h1>

                    <div className="tour-meta">
                      <span>📍 {tour.location}</span>
                      <span>⏱️ {tour.duration}</span>
                      <span>👥 {tour.capacity}</span>
                      <span>⭐ {tour.rating} ({tour.reviews} reviews)</span>
                    </div>

                    <div className="tour-price">{tour.price}</div>

                    <p className="tour-description">{tour.description}</p>

                    <div className="tour-guide">
                      <div className="guide-avatar">
                        {tour.guide?.initials}
                      </div>
                      <div className="guide-info">
                        <span>{tour.guide?.name}</span>
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

                    <div className="tour-cta">
                      <button className="btn btn-hero" onClick={() => alert('Booking flow goes here')}>
                        Book Now
                      </button>
                      <button className="btn btn-outline" onClick={() => navigate('/tours')}>
                        See all tours
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

import React, { useEffect } from 'react'

export default function Features() {
  useEffect(() => {
    // Select all feature cards and give them initial animation setup
    const featureCards = document.querySelectorAll('.feature-card')
    featureCards.forEach(card => card.classList.add('animate-init'))

    // When a card comes into view trigger animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('animate-in')
      })
    }, { threshold: 0.15 })

    featureCards.forEach(card => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  const featuresList = [
    {
      icon: (
        <>
          <path d="M9 12l2 2 4-4"/>
          <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h9l4-4h5z"/>
        </>
      ),
      color: 'feature-icon-green',
      title: 'Verified Local Guides',
      description:
        'All our guides are background-checked and certified, so you can travel with confidence and peace of mind.'
    },
    {
      icon: (
        <>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="m22 21-3-3"/>
        </>
      ),
      color: 'feature-icon-saffron',
      title: 'Authentic Experiences',
      description:
        'Meet locals who share genuine cultural stories and show you hidden gems off the beaten path.'
    },
    {
      icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>,
      color: 'feature-icon-blue',
      title: 'Real-time Communication',
      description:
        'Chat instantly with your guide to personalize your trip and get real-time answers.'
    },
    {
      icon: (
        <>
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </>
      ),
      color: 'feature-icon-gold',
      title: 'Multi-language Support',
      description:
        'Available in multiple languages — connect with guides who speak your preferred language.'
    },
    {
      icon: (
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
      ),
      color: 'feature-icon-green',
      title: 'Rated & Reviewed',
      description:
        'Every guide and experience is rated by real travelers — no fake reviews, only honest feedback.'
    },
    {
      icon: (
        <>
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </>
      ),
      color: 'feature-icon-saffron',
      title: 'Hidden Destinations',
      description:
        'Discover secret locations and local favorites known only to authentic Sri Lankan insiders.'
    }
  ]

  return (
    <section className="features" id="features">
      <div className="container">
        <header className="section-header">
          <h2 className="section-title">
            Why Choose <span className="gradient-text">CeylonConnect</span>?
          </h2>
          <p className="section-subtitle">
            Explore Sri Lanka like never before — with trusted guides, real connections, and unforgettable memories.
          </p>
        </header>

        <div className="features-grid">
          {featuresList.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-content">
                <div className="feature-icon-container">
                  <svg
                    className={`feature-icon ${feature.color}`}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    {feature.icon}
                  </svg>
                </div>
                <div className="feature-text">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

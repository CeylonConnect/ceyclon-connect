import React from 'react'

export default function Footer() {
  const handleSocialClick = (platform) => {
    const messages = {
      facebook: 'Opening our Facebook page...',
      instagram: 'Opening our Instagram...',
      twitter: 'Opening our Twitter feed...'
    }
    alert(messages[platform] || 'Opening social link...')
  }

  const handleLink = (message, event) => {
    event.preventDefault()
    alert(message)
  }

  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-content">
          
          {/* Logo + About Section */}
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <span className="logo-text">CeylonConnect</span>
            </div>

            <p className="footer-description">
              Connecting travelers with real Sri Lankan adventures through trusted local guides.
            </p>

            <div className="footer-social">
              <button className="social-btn" onClick={() => handleSocialClick('facebook')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </button>

              <button className="social-btn" onClick={() => handleSocialClick('instagram')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="m16 11.37-4-4-4 4V16a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2z" />
                  <circle cx="16" cy="8" r="1" />
                </svg>
              </button>

              <button className="social-btn" onClick={() => handleSocialClick('twitter')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><a href="#tours">Browse Tours</a></li>
              <li><a href="#guides">Find Guides</a></li>
              <li><a href="#guides" onClick={(e) => handleLink('Redirecting to guide registration...', e)}>Become a Guide</a></li>
              <li><a href="#" onClick={(e) => handleLink('Opening safety guidelines...', e)}>Safety Guidelines</a></li>
              <li><a href="#" onClick={(e) => handleLink('Opening travel tips...', e)}>Travel Tips</a></li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="footer-section">
            <h3 className="footer-title">Support</h3>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => handleLink('Opening Help Center...', e)}>Help Center</a></li>
              <li><a href="#" onClick={(e) => handleLink('Opening Contact Us...', e)}>Contact Us</a></li>
              <li><a href="#" onClick={(e) => handleLink('Opening Privacy Policy...', e)}>Privacy Policy</a></li>
              <li><a href="#" onClick={(e) => handleLink('Opening Terms of Service...', e)}>Terms of Service</a></li>
              <li><a href="#" onClick={(e) => handleLink('Opening Refund Policy...', e)}>Refund Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3 className="footer-title">Contact Info</h3>
            <div className="footer-contact">

              <div className="contact-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <p>123 Galle Road, Colombo 03<br />Sri Lanka</p>
              </div>

              <div className="contact-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <p>+94 11 234 5678</p>
              </div>

              <div className="contact-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <p>hello@ceylonconnect.lk</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© 2025 CeylonConnect. All rights reserved.</p>
          <p>Made with ❤️ for Sri Lankan tourism</p>
        </div>
      </div>
    </footer>
  )
}

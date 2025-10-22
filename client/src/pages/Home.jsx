import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Header from "../components/Header.jsx"
import Hero from "../components/Hero.jsx"
import Features from "../components/Features.jsx"
import Tours from "../components/Tours.jsx"
import Guides from "../components/Guides.jsx"
import Footer from "../components/Footer.jsx"
import { fetchGuides, fetchTours } from '../services/api.js'
import '../style.css'

export default function App() {
  const [headerHidden, setHeaderHidden] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const toursRef = useRef(null)

  // Hide-on-scroll header
  useEffect(() => {
    let last = 0
    const onScroll = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop
      if (st > last && st > 100) setHeaderHidden(true)
      else setHeaderHidden(false)
      last = st
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTours = useCallback(() => {
    if (toursRef.current) {
      const headerEl = document.querySelector('.header')
      const headerHeight = headerEl ? headerEl.offsetHeight : 0
      const top = toursRef.current.offsetTop - headerHeight
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  const onSearch = useCallback(() => {
    if (searchTerm.trim()) {
      scrollToTours()
      alert(`Searching for tours in: ${searchTerm.trim()}`)
    }
  }, [searchTerm, scrollToTours])

  // Load data (API with graceful fallback to mock)
  const [tours, setTours] = useState([])
  const [guides, setGuides] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      const [t, g] = await Promise.all([fetchTours(), fetchGuides()])
      if (mounted) {
        setTours(t)
        setGuides(g)
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const appContent = useMemo(() => (
    <>
      <Hero
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={onSearch}
      />
      <Features />
      <div id="tours" ref={toursRef}>
        <Tours tours={tours} loading={loading} />
      </div>
      <Guides guides={guides} />
    </>
  ), [guides, loading, onSearch, searchTerm, tours])

  return (
    <>
      <Header hidden={headerHidden} />
      <main>
        {appContent}
      </main>
      <Footer />
    </>
  )
}
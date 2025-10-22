// Minimal API layer with graceful fallback to mock data.
// Point VITE_API_BASE to your ceyclon-connect-api when ready.

import { mockGuides, mockTours } from '../data/mock.js'

const API_BASE = import.meta.env.VITE_API_BASE

async function get(path) {
  if (!API_BASE) return null
  try {
    const res = await fetch(`${API_BASE}${path}`)
    if (!res.ok) throw new Error('Bad response')
    return await res.json()
  } catch {
    return null
  }
}

export async function fetchTours() {
  // Expected API response shape (example):
  // [{ id, title, image, category, price, location, description, duration, capacity, rating, reviews, guide: {name, initials} }]
  const data = await get('/tours')
  return Array.isArray(data) && data.length ? data : mockTours
}

export async function fetchGuides() {
  // Expected API response shape (example):
  // [{ id, name, initials, specialty, location, description, rating, ratingCount, tours, languages:[], badges:[] }]
  const data = await get('/guides')
  return Array.isArray(data) && data.length ? data : mockGuides
}
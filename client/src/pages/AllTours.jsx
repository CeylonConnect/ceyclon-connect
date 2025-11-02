import React, { useEffect, useMemo, useState } from 'react'
import Header from "../components/Header.jsx"
import Footer from "../components/Footer.jsx"
import Tours from "../components/Tours.jsx"
import { fetchTours } from "../services/api.js"
import '../style.css'

export default function AllTours() {
	const [tours, setTours] = useState([])
	const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

	useEffect(() => {
		let mounted = true
		;(async () => {
			setLoading(true)
			const data = await fetchTours()
			if (mounted) {
				setTours(data)
				setLoading(false)
			}
		})()
		return () => { mounted = false }
	}, [])

	const filteredTours = useMemo(() => {
		if (!search.trim()) return tours
		const term = search.trim().toLowerCase()
		return tours.filter(t =>
			(t.title && t.title.toLowerCase().includes(term)) ||
			(t.location && t.location.toLowerCase().includes(term)) ||
			(t.description && t.description.toLowerCase().includes(term))
		)
	}, [search, tours])

	return (
		<>
			<Header
				hideNavLinks
				middleContent={
					<div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', justifyContent: 'center' }}>
						<h3 style={{ margin: 0 }}>All Tours</h3>
						<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
							<input
								type="text"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search tours..."
								aria-label="Search tours"
								style={{
									padding: '8px 12px',
									border: '1px solid var(--border, #e2e8f0)',
									borderRadius: 8,
									minWidth: 220
								}}
							/>
							<span style={{ fontSize: 12, color: 'var(--muted-foreground, #64748b)' }}>
								{loading ? 'Loading…' : `${filteredTours.length} result${filteredTours.length === 1 ? '' : 's'}`}
							</span>
						</div>
					</div>
				}
			/>
			<main>
				<div style={{ paddingTop: '4rem' }}>
					<Tours tours={filteredTours} loading={loading} title="All" showViewAll={false} />
				</div>
			</main>
			<Footer />
		</>
	)
}

import React, { useEffect, useState } from 'react'
import Header from "../components/Header.jsx"
import Footer from "../components/Footer.jsx"
import Tours from "../components/Tours.jsx"
import { fetchTours } from "../services/api.js"
import '../style.css'

export default function AllTours() {
	const [tours, setTours] = useState([])
	const [loading, setLoading] = useState(true)

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

	return (
		<>
			<Header />
			<main>
				<div style={{ paddingTop: '4rem' }}>
					<Tours tours={tours} loading={loading} title="All" showViewAll={false} />
				</div>
			</main>
			<Footer />
		</>
	)
}

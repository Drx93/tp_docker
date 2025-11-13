import React, { useEffect, useState } from 'react'

export default function RestaurantInfo({ id: propId }) {
    const [restaurant, setRestaurant] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const rid = propId || (() => {
            const m = window.location.pathname && window.location.pathname.match(/^\/restaurants\/(.+)$/)
            return m ? decodeURIComponent(m[1]) : null
        })()
        if (!rid) return
        let mounted = true
        ;(async () => {
            setLoading(true)
            setError(null)
            try {
                const token = localStorage.getItem('accessToken')
                const res = await fetch(`/api/restaurants/${encodeURIComponent(rid)}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                })
                if (!res.ok) throw new Error(`Erreur ${res.status}`)
                const data = await res.json()
                if (mounted) setRestaurant(data)
            } catch (err) {
                if (mounted) setError(err.message || 'Erreur lors de la récupération')
            } finally {
                if (mounted) setLoading(false)
            }
        })()
        return () => { mounted = false }
    }, [propId])

    if (!propId && !window.location.pathname.match(/^\/restaurants\//)) return null

    return (
        <div style={{ padding: 24 }}>
            <nav style={{ marginBottom: 12 }}>
                <a href="/restaurants" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/restaurants'); window.dispatchEvent(new PopStateEvent('popstate')) }}>Retour</a>
            </nav>
            <main className="card" style={{ padding: 16 }}>
                <h2>Informations sur le restaurant</h2>
                {loading && <p>Chargement…</p>}
                {error && <p style={{ color: 'crimson' }}>{error}</p>}
                {restaurant && (
                    <div>
                        <h3 style={{ marginTop: 0 }}>{restaurant.title || restaurant.name}</h3>
                        {restaurant.address && <p><strong>Adresse:</strong> {restaurant.address}</p>}
                        {restaurant.rating != null && <p><strong>Note:</strong> {restaurant.rating}</p>}
                        {restaurant.reviews != null && <p><strong>Avis:</strong> {restaurant.reviews}</p>}
                        {restaurant.description && <p>{restaurant.description}</p>}
                    </div>
                )}
            </main>
        </div>
    )
}




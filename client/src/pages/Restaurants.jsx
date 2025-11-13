import React, { useEffect, useState } from 'react'
import RestaurantInfo from './RestaurantInfos'

export default function Restaurants() {
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
      if (!token) {
        // Redirect to login when token is missing (SPA pushState + notify)
        window.history.pushState({}, '', '/login')
        window.dispatchEvent(new PopStateEvent('popstate'))
        return
    }

    // Validate token with server to ensure it's valid (not just present)
    (async () => {
      try {
        const res = await fetch('/auth/validate', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.status === 200) {
          setChecking(false)
          return
        }
      } catch (e) {
        // ignore
      }
        // invalid -> redirect
        localStorage.removeItem('accessToken')
        window.history.pushState({}, '', '/login')
        window.dispatchEvent(new PopStateEvent('popstate'))
    })()
  }, [])

  if (checking) {
    return (
      <div style={{ padding: 24 }}>
        <main className="card">
          <p>Vérification des droits…</p>
        </main>
      </div>
    )
  }

  // Child component can safely use hooks even though parent does an early return
  function RestaurantsList() {
    const [restaurants, setRestaurants] = React.useState(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState(null)

    React.useEffect(() => {
      let mounted = true
      const token = localStorage.getItem('accessToken')
      ;(async () => {
        try {
          const res = await fetch('/api/restaurants', {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          })
          if (!res.ok) throw new Error(`Erreur ${res.status}`)
          const data = await res.json()
          if (mounted) {
            setRestaurants(Array.isArray(data) ? data : [])
            setLoading(false)
          }
        } catch (err) {
          if (mounted) {
            setError(err.message || 'Erreur lors de la récupération')
            setLoading(false)
          }
        }
      })()
      return () => {
        mounted = false
      }
    }, [])

    if (loading) return <p>Chargement des restaurants…</p>
    if (error) return <p style={{ color: 'red' }}>{error}</p>
    if (!restaurants || restaurants.length === 0) return <p>Aucun restaurant trouvé.</p>

    return (
      <article>
      {restaurants.map((r) => {
        const id = r.id || r._id
        const key = id || JSON.stringify(r)
        const go = () => {
        if (id) {
          // navigate using history.pushState so URL becomes /restaurants/:id
          window.history.pushState({}, '', `/restaurants/${id}`)
          window.dispatchEvent(new PopStateEvent('popstate'))
        }
        }
        return (
          <div
            key={key}
            id={key}
            onClick={go}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          go()
              }
            }}
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center', padding: 8 }}
          >
            <img
              src={r.thumbnail}
              alt={`Photo de ${r.title || 'du restaurant'}`}
              style={{ width: 32, height: 32, objectFit: 'cover', verticalAlign: 'middle', marginRight: 8 }}
            />
            <div>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{r.title || 'Sans nom'}</p>
              <p style={{ margin: 0 }}>{r.address}</p>
              <p style={{ margin: 0 }}>{'Note : ' + (r.rating ?? 'N/A')}</p>
              <p style={{ margin: 0 }}>{'Nombre d\'avis : ' + (r.reviews ?? 0)}</p>
            </div>
          </div>
        )
      })}

      </article>
    )
  }

  return (
    <div style={{ padding: 24 }}>
      <nav style={{ marginBottom: 12 }}>
          <a href="/" onClick={e => { e.preventDefault(); window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')) }}>Accueil</a> | <strong>Restaurants</strong>
      </nav>
      <main className="card" id='mainRestaurants' style={{ padding: 16 }}>
        <h2>Liste des Restaurants</h2>
        <RestaurantsList />
      </main>
      <RestaurantInfo />
    </div>
  )
}


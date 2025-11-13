import React, { useEffect, useState } from 'react'

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

  return (
    <div style={{ padding: 24 }}>
      <nav style={{ marginBottom: 12 }}>
          <a href="/" onClick={e => { e.preventDefault(); window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')) }}>Accueil</a> | <strong>Restaurants</strong>
      </nav>
      <main className="card">
        <h1>Restaurants</h1>
        <p style={{ color: '#666' }}>Page liste des restaurants (placeholder)</p>
      </main>
    </div>
  )
}

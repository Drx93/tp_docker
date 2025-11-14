import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Restaurants from './pages/Restaurants'
import RestaurantInfo from './pages/RestaurantInfos'
import Profile from './pages/Profile'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [path, setPath] = useState(() => window.location.pathname || '/')
  const [token, setToken] = useState(() => localStorage.getItem('accessToken'))

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname || '/')
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    if (path === '/' || path === '') fetchStatus()
  }, [path])

  async function fetchStatus() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/status')
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      const body = await res.json()
      setStatus(body)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleLogin(newToken) {
    setToken(newToken)
  }

  function logout() {
    localStorage.removeItem('accessToken')
    setToken(null)
  }

  // simple hash routing
  if (path === '/login') {
    return (
      <div style={{ padding: 24 }}>
        <nav style={{ marginBottom: 12 }}>
          <a href="/" onClick={e => { e.preventDefault(); window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')) }}>Accueil</a> | <strong>Login</strong>
        </nav>
        <main className="card">
          <Login onLogin={handleLogin} />
          {token && <p style={{ color: 'green', marginTop: 12 }}>Connecté (token stocké)</p>}
        </main>
      </div>
    )
  }

  if (path === '/restaurants') {
    return (
      <div style={{ padding: 24 }}>
        <Restaurants />
      </div>
    )
  }

  // route: /restaurants/:id -> show restaurant detail
  if (path.startsWith('/restaurants/') ) {
    const parts = path.split('/')
    const id = parts[2] ? decodeURIComponent(parts[2]) : null
    return (
      <div style={{ padding: 24 }}>
        <RestaurantInfo id={id} />
      </div>
    )
  }
  

  if (path === '/profile') {
    return (
      <div style={{ padding: 24 }}>
        <Profile />
      </div>
    )
  }

  if (path === '/register') {
    return (
      <div style={{ padding: 24 }}>
        <nav style={{ marginBottom: 12 }}>
          <a href="/" onClick={e => { e.preventDefault(); window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')) }}>Accueil</a> | <strong>Inscription</strong>
        </nav>
        <main className="card">
          <Register />
        </main>
      </div>
    )
  }

  return (
    <div className="app-root">
      <Header token={token} logout={logout} />

      <main className="card" style={{ margin: 24 }}>
        <section>
          <h2>État de l'API</h2>
          <div>
            <button onClick={fetchStatus} disabled={loading}>
              {loading ? 'Chargement…' : 'Rafraîchir'}
            </button>
          </div>
          {error && <p style={{ color: 'crimson' }}>Erreur : {error}</p>}
          {status && <pre className="mono">{JSON.stringify(status, null, 2)}</pre>}
          {!status && !error && !loading && <p style={{ color: '#666' }}>Aucune donnée — clique sur Rafraîchir.</p>}
        </section>

        <section style={{ marginTop: 16, textAlign: 'left' }}>
          <h2>Liens utiles</h2>
          <ul>
            <li><a href="/restaurants" onClick={e => { e.preventDefault(); window.history.pushState({}, '', '/restaurants'); window.dispatchEvent(new PopStateEvent('popstate')) }}>Page Restaurants (client)</a></li>
            <li><a href="/api/restaurants">GET /api/restaurants</a></li>
            <li><a href="/auth">Auth endpoints (login/refresh)</a></li>
            <li><a href="/api/user-restaurants/select">POST /api/user-restaurants/select</a> (liaison user↔restaurant)</li>
          </ul>
        </section>

      </main>

      <Footer />
    </div>
  )
}

export default App

import { useEffect, useState } from 'react'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Restaurants from './pages/Restaurants'

function App() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hash, setHash] = useState(() => window.location.hash || '#/')
  const [token, setToken] = useState(() => localStorage.getItem('accessToken'))

  useEffect(() => {
    const onHash = () => setHash(window.location.hash || '#/')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    if (hash === '#/' || hash === '') fetchStatus()
  }, [hash])

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
  if (hash === '#/login') {
    return (
      <div style={{ padding: 24 }}>
        <nav style={{ marginBottom: 12 }}>
          <a href="#/">Accueil</a> | <strong>Login</strong>
        </nav>
        <main className="card">
          <Login onLogin={handleLogin} />
          {token && <p style={{ color: 'green', marginTop: 12 }}>Connecté (token stocké)</p>}
        </main>
      </div>
    )
  }

  if (hash === '#/restaurants') {
    return (
      <div style={{ padding: 24 }}>
        <Restaurants />
      </div>
    )
  }
  

  if (hash === '#/register') {
    return (
      <div style={{ padding: 24 }}>
        <nav style={{ marginBottom: 12 }}>
          <a href="#/">Accueil</a> | <strong>Inscription</strong>
        </nav>
        <main className="card">
          <Register />
        </main>
      </div>
    )
  }

  return (
    <div>
      <header style={{ padding: 24 }}>
        <h1>Orium Agence — Front (Vite + React)</h1>
        <p style={{ color: '#666' }}>Page d'accueil du client React</p>
        <nav style={{ marginTop: 8 }}>
          <a href="#/">Accueil</a> |
          <a href="#/login" style={{ marginLeft: 8 }}>Login</a> |
          <a href="#/register" style={{ marginLeft: 8 }}>Inscription</a>
          {token && <button onClick={logout} style={{ marginLeft: 12 }}>Logout</button>}
        </nav>
      </header>

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
            <li><a href="#/restaurants">Page Restaurants (client)</a></li>
            <li><a href="/api/restaurants">GET /api/restaurants</a></li>
            <li><a href="/auth">Auth endpoints (login/refresh)</a></li>
            <li><a href="/api/user-restaurants/select">POST /api/user-restaurants/select</a> (liaison user↔restaurant)</li>
          </ul>
        </section>

        <section style={{ marginTop: 16 }}>
          <h2>Prochaine étape</h2>
          <p style={{ color: '#444' }}>Si tu veux, je peux ajouter une page <em>Restaurants</em> qui affiche la liste et une page <em>Mon espace</em> protégée par token.</p>
        </section>
      </main>
    </div>
  )
}

export default App

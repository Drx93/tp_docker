import { useState } from 'react'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(`${res.status} ${res.statusText} - ${txt}`)
      }
      const body = await res.json()
      // expected { accessToken: '...' }
      if (body.accessToken) {
        localStorage.setItem('accessToken', body.accessToken)
        onLogin && onLogin(body.accessToken)
      } else {
        throw new Error('Réponse inattendue du serveur')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Se connecter</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label className="form-label">
          Email
          <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>

        <label className="form-label">
          Mot de passe
          <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>

        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>{loading ? 'Connexion…' : "Se connecter"}</button>
        </div>

        {error && <p style={{ color: 'crimson', marginTop: 12 }}>{error}</p>}
      </form>
    </div>
  )
}

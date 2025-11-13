import { useState } from 'react'

export default function Register() {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstname, lastname, email, password })
      })
      const text = await res.text()
      if (!res.ok) {
        // try parse json
        try {
          const json = JSON.parse(text)
          throw new Error(json.error || text)
        } catch (_) {
          throw new Error(text || `${res.status} ${res.statusText}`)
        }
      }
      // success
      setSuccess('Compte créé — tu peux maintenant te connecter.')
      // optionally clear form
      setFirstname('')
      setLastname('')
      setEmail('')
      setPassword('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 480, margin: '0 auto', textAlign: 'left' }}>
        <label style={{ display: 'block', marginBottom: 8 }}>
          Prénom
          <input value={firstname} onChange={e => setFirstname(e.target.value)} required style={{ width: '100%', padding: 8, marginTop: 6 }} />
        </label>

        <label style={{ display: 'block', marginBottom: 8 }}>
          Nom
          <input value={lastname} onChange={e => setLastname(e.target.value)} required style={{ width: '100%', padding: 8, marginTop: 6 }} />
        </label>

        <label style={{ display: 'block', marginBottom: 8 }}>
          Email
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: 8, marginTop: 6 }} />
        </label>

        <label style={{ display: 'block', marginBottom: 8 }}>
          Mot de passe
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: 8, marginTop: 6 }} />
        </label>

        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>{loading ? 'Enregistrement…' : 'S’inscrire'}</button>
        </div>

        {error && <p style={{ color: 'crimson', marginTop: 12 }}>{error}</p>}
        {success && <p style={{ color: 'green', marginTop: 12 }}>{success} <a href="/login" onClick={e => { e.preventDefault(); window.history.pushState({}, '', '/login'); window.dispatchEvent(new PopStateEvent('popstate')) }}>Se connecter</a></p>}
      </form>
    </div>
  )
}

import React, { useEffect, useState } from 'react'

export default function Profile() {
  const [checking, setChecking] = useState(true)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      window.history.pushState({}, '', '/login')
      window.dispatchEvent(new PopStateEvent('popstate'))
      return
    }

    // Validate token and load user data
    ;(async () => {
      try {
        const v = await fetch('/auth/validate', { headers: { Authorization: `Bearer ${token}` } })
        if (!v.ok) throw new Error('Token invalide')
        const body = await v.json()
        const id = body.user && body.user.id
        if (!id) throw new Error('Utilisateur introuvable dans token')

        const res = await fetch(`/api/users/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        if (!res.ok) throw new Error('Impossible de récupérer les informations utilisateur')
        const data = await res.json()
        setUser(data)
        setChecking(false)
      } catch (e) {
        localStorage.removeItem('accessToken')
        window.history.pushState({}, '', '/login')
        window.dispatchEvent(new PopStateEvent('popstate'))
      }
    })()
  }, [])

  async function handleSave(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      const id = user.id
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ firstname: user.firstname, lastname: user.lastname, email: user.email })
      })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || `${res.status} ${res.statusText}`)
      }
      const updated = await res.json()
      setUser(updated)
      setSuccess('Profil mis à jour.')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Supprimer votre compte ? Cette action est irréversible.')) return
    setError(null)
    setLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      const id = user.id
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.status !== 204) {
        const txt = await res.text()
        throw new Error(txt || `${res.status} ${res.statusText}`)
      }
      // deleted
      localStorage.removeItem('accessToken')
  window.history.pushState({}, '', '/')
  window.dispatchEvent(new PopStateEvent('popstate'))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div style={{ padding: 24 }}>
        <main className="card">
          <p>Vérification et chargement du profil…</p>
        </main>
      </div>
    )
  }

  return (
    <div style={{ padding: 24 }}>
      <nav style={{ marginBottom: 12 }}>
        <a href="/" onClick={e => { e.preventDefault(); window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')) }}>Accueil</a> | <strong>Mon profil</strong>
      </nav>
      <main className="card" style={{ maxWidth: 640 }}>
        <h1>Mon profil</h1>
        <form onSubmit={handleSave} style={{ textAlign: 'left' }}>
          <label className="form-label">
            Prénom
            <input value={user.firstname || ''} onChange={e => setUser({ ...user, firstname: e.target.value })} required style={{ width: '100%', padding: 8, marginTop: 6 }} />
          </label>

          <label className="form-label">
            Nom
            <input value={user.lastname || ''} onChange={e => setUser({ ...user, lastname: e.target.value })} required style={{ width: '100%', padding: 8, marginTop: 6 }} />
          </label>

          <label className="form-label">
            Email
            <input type="email" value={user.email || ''} onChange={e => setUser({ ...user, email: e.target.value })} required style={{ width: '100%', padding: 8, marginTop: 6 }} />
          </label>

          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>{loading ? 'Enregistrement…' : 'Enregistrer'}</button>
            <button type="button" onClick={handleDelete} disabled={loading} style={{ padding: '8px 12px', background: '#f55', color: 'white' }}>{loading ? 'Traitement…' : 'Supprimer mon compte'}</button>
          </div>

          {error && <p style={{ color: 'crimson', marginTop: 12 }}>{error}</p>}
          {success && <p style={{ color: 'green', marginTop: 12 }}>{success}</p>}
        </form>
      </main>
    </div>
  )
}

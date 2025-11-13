import React from 'react'

export default function Header({ token, logout }) {
  return (
    <header className="app-header">
      <div className="container">
        <div className="brand">
          <h1>Orium Agence — Front</h1>
          <p className="subtitle">Client React</p>
        </div>

        <nav className="main-nav">
          <a href="/" onClick={e => { e.preventDefault(); window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')) }}>Accueil</a>
          <a href="/login" onClick={e => { e.preventDefault(); window.history.pushState({}, '', '/login'); window.dispatchEvent(new PopStateEvent('popstate')) }}>Login</a>
          <a href="/register" onClick={e => { e.preventDefault(); window.history.pushState({}, '', '/register'); window.dispatchEvent(new PopStateEvent('popstate')) }}>Inscription</a>
          {token && <>
            <a href="/profile" onClick={e => { e.preventDefault(); window.history.pushState({}, '', '/profile'); window.dispatchEvent(new PopStateEvent('popstate')) }}>Mon profil</a>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </>}
        </nav>
      </div>
    </header>
  )
}

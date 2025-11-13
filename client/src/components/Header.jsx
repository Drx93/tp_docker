import React from 'react'

function navigate(e, to) {
  e.preventDefault()
  window.history.pushState({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export default function Header({ token, logout }) {
  return (
    <header className="app-header">
      <div className="container">
        <div className="brand">
          <h1>Orium Agence — Front</h1>
        </div>

        <nav id="main-navigation" className={`main-nav`} aria-label="Main navigation">
          <ul>
            <li><a href="/" onClick={e => navigate(e, '/')}>Accueil</a></li>
            <li><a href="/restaurants" onClick={e => navigate(e, '/restaurants')}>Restaurants</a></li>
            <li><a href="/login" onClick={e => navigate(e, '/login')}>Login</a></li>
            <li><a href="/register" onClick={e => navigate(e, '/register')}>Inscription</a></li>
            {token ? (
              <>
                <li><a href="/profile" onClick={e => navigate(e, '/profile')}>Mon profil</a></li>
                <li><button className="logout-btn" onClick={logout}>Logout</button></li>
              </>
            ) : null}
          </ul>
        </nav>
      </div>
    </header>
  )
}

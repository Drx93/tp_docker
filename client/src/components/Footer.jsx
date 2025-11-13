import React from 'react'

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="container">
        <small>© {new Date().getFullYear()} Orium Agence — Demo</small>
        <nav className="footer-nav">
          <a href="/">Accueil</a>
          <a href="/auth">API Auth</a>
        </nav>
      </div>
    </footer>
  )
}

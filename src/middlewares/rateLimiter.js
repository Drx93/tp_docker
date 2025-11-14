// Middleware de limitation de débit pour une application Express
// Permet de limiter le nombre de requêtes par IP sur une fenêtre de temps donnée.

const rateLimit = require('express-rate-limit'); // importe le package express-rate-limit

/**
 * Exporte une instance de rate limiter par défaut et une factory
 * pour créer des limiteurs personnalisés.
 */
const defaultLimiter = rateLimit({
  // Durée de la fenêtre en millisecondes (ici 5 minutes)
  windowMs: 5 * 60 * 1000,
  // Nombre maximum de requêtes autorisées par IP pendant la fenêtre
  max: 1000,
  // Active l'en-tête standard RateLimit-* (RFC)
  standardHeaders: true,
  // Désactive les anciens en-têtes X-RateLimit-*
  legacyHeaders: false,
  // Message renvoyé au client quand la limite est atteinte
  message: { error: 'Trop de requêtes, réessayez plus tard.' }
});

/**
 * Crée un rate limiter personnalisé.
 * opts peut contenir n'importe quelle option acceptée par express-rate-limit.
 * Les valeurs par défaut sont identiques à celles de defaultLimiter.
 */
function createLimiter(opts = {}) {
  return rateLimit(Object.assign({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 1000, // 1000 requêtes par IP par fenêtre
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Trop de requêtes, réessayez plus tard.' }
  }, opts)); // les options passées en argument écrasent les valeurs par défaut
}

// Exporte le limiteur par défaut et la factory pour usage dans l'application
module.exports = { defaultLimiter, createLimiter };

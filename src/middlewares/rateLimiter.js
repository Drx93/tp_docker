const rateLimit = require('express-rate-limit');

/**
 * Exporte une instance de rate limiter par défaut et une factory
 * pour créer des limiteurs personnalisés.
 */
const defaultLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 1000, // limite chaque IP à 1000 requêtes par windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de requêtes, réessayez plus tard.' }
});

function createLimiter(opts = {}) {
  return rateLimit(Object.assign({
    windowMs: 5 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Trop de requêtes, réessayez plus tard.' }
  }, opts));
}

module.exports = { defaultLimiter, createLimiter };

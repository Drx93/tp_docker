const rateLimit = require('express-rate-limit');

/**
 * Exporte une instance de rate limiter par défaut et une factory
 * pour créer des limiteurs personnalisés.
 */
const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de requêtes, réessayez plus tard.' }
});

function createLimiter(opts = {}) {
  return rateLimit(Object.assign({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Trop de requêtes, réessayez plus tard.' }
  }, opts));
}

module.exports = { defaultLimiter, createLimiter };

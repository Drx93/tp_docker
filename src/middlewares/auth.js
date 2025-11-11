const jwt = require('jsonwebtoken');

/**
 * Middleware d'authentification JWT.
 * - Lit l'en-tête Authorization: Bearer <token>
 * - Vérifie la signature et l'expiration via process.env.JWT_SECRET
 * - Injecte req.user = { id, role } si token valide
 * - Renvoie 401 si token manquant ou invalide
 */
module.exports = function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return res.status(401).json({ error: 'Token manquant' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // payload should contain at least { sub, role }
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

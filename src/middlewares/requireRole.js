/**
 * Middleware de contrôle de rôle.
 * Usage:
 *   const requireRole = require('./requireRole');
 *   app.get('/admin', auth, requireRole('admin'), handler);
 * Accepte soit une string (role unique) soit un tableau de rôles autorisés.
 */
module.exports = function requireRole(expected) {
  const allowed = Array.isArray(expected) ? expected : [expected];
  return function (req, res, next) {
    if (!req.user) return res.status(401).json({ error: 'Non authentifié' });
    if (!allowed.includes(req.user.role)) return res.status(403).json({ error: 'Accès refusé' });
    return next();
  };
};

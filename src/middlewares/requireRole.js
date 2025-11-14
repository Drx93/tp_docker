/**
 * Middleware de contrôle de rôle.
 * Usage:
 *   const requireRole = require('./requireRole');
 *   app.get('/admin', auth, requireRole('admin'), handler);
 * Paramètre:
 *   expected - string (rôle unique) ou array de strings (rôles autorisés)
 * Retourne un middleware express qui vérifie que req.user.role est dans la liste autorisée.
 */
module.exports = function requireRole(expected) {
  // Normalise la valeur attendue en tableau pour simplifier la vérification
  const allowed = Array.isArray(expected) ? expected : [expected];

  return function (req, res, next) {
    // Si l'utilisateur n'est pas attaché à la requête -> non authentifié
    if (!req.user) return res.status(401).json({ error: 'Non authentifié' });

    // Si le rôle de l'utilisateur n'est pas dans la liste des rôles autorisés -> accès refusé
    if (!allowed.includes(req.user.role)) return res.status(403).json({ error: 'Accès refusé' });

    // Rôle autorisé -> poursuivre le traitement
    return next();
  };
};

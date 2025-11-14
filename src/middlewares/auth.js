const jwt = require('jsonwebtoken');

/**
 * Middleware d'authentification JWT.
 * - Lit l'en-tête Authorization: Bearer <token>
 * - Vérifie la signature et l'expiration via process.env.JWT_SECRET
 * - Injecte req.user = { id, role } si le token est valide
 * - Renvoie 401 si le token est manquant ou invalide
 */
module.exports = function auth(req, res, next) {
  // Récupère l'en-tête Authorization (ex: "Bearer eyJ...")
  const header = req.headers.authorization || '';

  // Extrait le token si l'en-tête commence par "Bearer "
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  // Si pas de token, refuse l'accès
  if (!token) return res.status(401).json({ error: 'Token manquant' });

  try {
    // Vérifie et décode le token avec la clé secrète
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // On s'attend à ce que le payload contienne au moins { sub, role }
    // Injecte les informations utilisateur dans la requête pour les handlers suivants
    req.user = { id: payload.sub, role: payload.role };
    // Passe au middleware suivant / à la route
    return next();
  } catch (err) {
    // En cas d'erreur de vérification (token invalide ou expiré), refuse l'accès
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

const bcrypt = require('bcrypt'); // chiffrement des mots de passe
const jwt = require('jsonwebtoken'); // gestion des JWT
const Users = require('../models/users.model'); // modèle utilisateur

const ACCESS_EXPIRES = process.env.ACCESS_EXPIRES || '1h'; // durée de validité du token

function signAccessToken(user) {
  // crée un JWT avec subject et rôle
  return jwt.sign({ sub: user.id, role: user.role_id || null }, process.env.JWT_SECRET, { expiresIn: ACCESS_EXPIRES });
}

// Pas de refresh-token : on ne délivre que des access tokens courts.

exports.login = async (req, res, next) => {
  try {
    // Vérifier que le secret est configuré pour éviter des erreurs internes
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment');
      return res.status(500).json({ error: 'Server configuration error: JWT_SECRET not set' });
    }

    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email et password requis' }); // paramètres manquants

    // Trouver l'utilisateur par email
    const user = await Users.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Identifiants invalides' }); // utilisateur introuvable

    // Comparer le mot de passe avec le hash stocké
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Identifiants invalides' }); // mot de passe incorrect

    // Générer et retourner le token d'accès
    const accessToken = signAccessToken(user);
    return res.json({ accessToken });
  } catch (e) { next(e); }
};
// Pas d'exports refresh() ou logout() — fonctionnalité supprimée.

// Endpoint de validation : vérifie la validité du token (middleware d'auth doit remplir req.user)
exports.validate = async (req, res, next) => {
  try {
    return res.json({ ok: true, user: req.user }); // renvoie l'utilisateur authentifié
  } catch (e) { next(e); }
};

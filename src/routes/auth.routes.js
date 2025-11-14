// Routes d'authentification
const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const { createLimiter } = require('../middlewares/rateLimiter');
const auth = require('../middlewares/auth');

// Limiteur strict pour la route de connexion afin de réduire les tentatives par force brute
const loginLimiter = createLimiter({ windowMs: 15 * 60 * 1000, max: 5 });

// Route de connexion (POST) avec limitation de débit
router.post('/login', loginLimiter, ctrl.login);

// Valide le token (route protégée) - renvoie l'utilisateur extrait du token
router.get('/validate', auth, ctrl.validate);

// Les endpoints refresh/logout ont été retirés car le flux de refresh-token a été désactivé

module.exports = router;

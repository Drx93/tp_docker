// Routes d'authentification
const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const { createLimiter } = require('../middlewares/rateLimiter');
const auth = require('../middlewares/auth');

// Limiteur strict pour la route de connexion afin de réduire les tentatives par force brute
const loginLimiter = createLimiter({ windowMs: 15 * 60 * 1000, max: 5 });

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Authentifie un utilisateur et retourne un JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLoginRequest'
 *     responses:
 *       200:
 *         description: Authentification réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthLoginResponse'
 *       400:
 *         description: Paramètres manquants
 *       401:
 *         description: Identifiants invalides
 */
router.post('/login', loginLimiter, ctrl.login);

/**
 * @openapi
 * /auth/validate:
 *   get:
 *     tags: [Auth]
 *     summary: Vérifie la validité du token et retourne l'utilisateur
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token valide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthValidateResponse'
 *       401:
 *         description: Token manquant ou invalide
 */
router.get('/validate', auth, ctrl.validate);

// Les endpoints refresh/logout ont été retirés car le flux de refresh-token a été désactivé

module.exports = router;

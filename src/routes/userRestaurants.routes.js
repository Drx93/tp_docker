// Router pour les routes liées aux restaurants sélectionnés par l'utilisateur
const router = require('express').Router();
const ctrl = require('../controllers/userRestaurants.controller');
const auth = require('../middlewares/auth');

/**
 * @openapi
 * /api/user-restaurants/select:
 *   post:
 *     tags: [User Restaurants]
 *     summary: Lie un utilisateur (Postgres) à un restaurant (Mongo)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRestaurantSelectionRequest'
 *     responses:
 *       201:
 *         description: Lien créé ou retourné
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRestaurantLink'
 *       400:
 *         description: Paramètres manquants
 *       404:
 *         description: Restaurant introuvable
 */
router.post('/select', ctrl.selectRestaurant);

/**
 * @openapi
 * /api/user-restaurants/like:
 *   post:
 *     tags: [User Restaurants]
 *     summary: Marque un restaurant comme favori pour l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRestaurantStatusUpdateRequest'
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRestaurantStatusUpdateResponse'
 *       400:
 *         description: Paramètres manquants
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Restaurant introuvable
 */
router.post('/like', auth, ctrl.markLiked);

/**
 * @openapi
 * /api/user-restaurants/unlike:
 *   post:
 *     tags: [User Restaurants]
 *     summary: Retire le statut favori
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRestaurantStatusUpdateRequest'
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRestaurantStatusUpdateResponse'
 *       400:
 *         description: Paramètres manquants
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Restaurant introuvable
 */
router.post('/unlike', auth, ctrl.unmarkLiked);

/**
 * @openapi
 * /api/user-restaurants/me:
 *   get:
 *     tags: [User Restaurants]
 *     summary: Retourne les restaurants liés à l'utilisateur courant
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des statuts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserRestaurantStatusRow'
 *       401:
 *         description: Non authentifié
 */
router.get('/me', auth, ctrl.getUserRestaurantsForUser);

module.exports = router;

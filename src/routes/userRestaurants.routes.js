// Router pour les routes liées aux restaurants sélectionnés par l'utilisateur
const router = require('express').Router();
const ctrl = require('../controllers/userRestaurants.controller'); // importe le contrôleur gérant la logique

// Crée ou retourne le lien entre un utilisateur et un restaurant
router.post('/select', ctrl.selectRestaurant);

module.exports = router; // exporte le routeur pour l'utiliser dans l'application

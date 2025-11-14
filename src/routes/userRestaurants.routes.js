const router = require('express').Router();
const ctrl = require('../controllers/userRestaurants.controller');
const auth = require('../middlewares/auth');

// Create or return link between user and restaurant
router.post('/select', ctrl.selectRestaurant);

// Mark a restaurant as liked for the authenticated user
router.post('/like', auth, ctrl.markLiked);
// Remove 'favori' status for the authenticated user
router.post('/unlike', auth, ctrl.unmarkLiked);

// Return current user's restaurant statuses
router.get('/me', auth, ctrl.getUserRestaurantsForUser);

module.exports = router;

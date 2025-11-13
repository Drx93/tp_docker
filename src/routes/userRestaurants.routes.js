const router = require('express').Router();
const ctrl = require('../controllers/userRestaurants.controller');

// Create or return link between user and restaurant
router.post('/select', ctrl.selectRestaurant);

module.exports = router;

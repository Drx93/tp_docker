const UserRestaurants = require('../models/userRestaurants.model');
const Restaurant = require('../models/restaurants.model');

async function selectRestaurant(req, res, next) {
  try {
    const { userId, restaurantId } = req.body || {};
    if (!userId || !restaurantId) return res.status(400).json({ error: 'userId et restaurantId requis' });

    const link = await UserRestaurants.linkUserToRestaurant(userId, restaurantId);
    // fetch restaurant details by dataId
    const dataId = link.restaurant_mongo_id;
    const restaurant = await Restaurant.findOne({ dataId }).lean();

    return res.status(201).json({ userId: link.user_id, restaurant, status: link.status || [] });
  } catch (e) {
    if (e.message && e.message.includes('introuvable')) return res.status(404).json({ error: 'Restaurant introuvable' });
    return next(e);
  }
}

module.exports = { selectRestaurant };

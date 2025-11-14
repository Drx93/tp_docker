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

/**
 * POST /api/user-restaurants/like
 * body: { restaurantId }
 * Requires auth middleware to inject req.user
 * Marks the given restaurant as 'like' for the current user
 */
async function markLiked(req, res, next) {
  try {
    const userId = req.user && req.user.id;
    const { restaurantId } = req.body || {};
    console.log('[markLiked] incoming', { userId, restaurantId });
    if (!userId || !restaurantId) return res.status(400).json({ error: 'userId et restaurantId requis' });

    // ensure link exists and get restaurant data id
    const link = await UserRestaurants.linkUserToRestaurant(userId, restaurantId);
    console.log('[markLiked] link', link);
    const restaurantDataId = link.restaurant_mongo_id;

    // merge statuses, add 'favori' without duplicates (DB accepts French values)
    const existing = Array.isArray(link.status) ? link.status : [];
    const toSet = Array.from(new Set([...(existing || []), 'favori']));

    const updated = await UserRestaurants.updateStatus(userId, restaurantDataId, toSet);
    console.log('[markLiked] updated', updated);
    if (!updated) return res.status(500).json({ error: "Impossible d'ajouter le statut" });

    return res.status(200).json({ userId: updated.user_id, restaurantDataId: updated.restaurant_mongo_id, status: updated.status });
  } catch (e) {
    if (e.message && e.message.includes('introuvable')) return res.status(404).json({ error: 'Restaurant introuvable' });
    return next(e);
  }
}
/**
 * POST /api/user-restaurants/unlike
 * body: { restaurantId }
 * Requires auth middleware to inject req.user
 * Removes the 'favori' status for the current user on the given restaurant
 */

async function unmarkLiked(req, res, next) {
  try {
    const userId = req.user && req.user.id;
    const { restaurantId } = req.body || {};
    if (!userId || !restaurantId) return res.status(400).json({ error: 'userId et restaurantId requis' });

    // ensure link exists and get restaurant data id
    const link = await UserRestaurants.linkUserToRestaurant(userId, restaurantId);
    const restaurantDataId = link.restaurant_mongo_id;

    const existing = Array.isArray(link.status) ? link.status : [];
    const toSet = existing.filter((s) => s !== 'favori');

    const updated = await UserRestaurants.updateStatus(userId, restaurantDataId, toSet);
    if (!updated) return res.status(500).json({ error: "Impossible de retirer le statut" });

    return res.status(200).json({ userId: updated.user_id, restaurantDataId: updated.restaurant_mongo_id, status: updated.status });
  } catch (e) {
    if (e.message && e.message.includes('introuvable')) return res.status(404).json({ error: 'Restaurant introuvable' });
    return next(e);
  }
}
module.exports = { selectRestaurant, markLiked, unmarkLiked };
module.exports.getUserRestaurantsForUser = async function getUserRestaurantsForUser(req, res, next) {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'Non authentifié' });
    const rows = await UserRestaurants.getUserRestaurants(userId);
    return res.json(rows || []);
  } catch (e) {
    return next(e);
  }
};

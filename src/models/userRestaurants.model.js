const db = require('../db/db-postgres');
const Restaurant = require('./restaurants.model');
const mongoose = require('mongoose');

/**
 * Business model to manage relationship between Postgres users and Mongo restaurants.
 * Postgres table: user_restaurant_status(user_id, restaurant_mongo_id, status text[])
 */

async function resolveRestaurantDataId(restaurantIdentifier) {
  if (!restaurantIdentifier) return null;
  // if it's a valid ObjectId, try to find by _id
  if (mongoose.Types.ObjectId.isValid(restaurantIdentifier)) {
    const r = await Restaurant.findById(restaurantIdentifier).lean();
    if (r && r.dataId) return r.dataId;
  }
  // else try to find by dataId directly
  const r2 = await Restaurant.findOne({ dataId: restaurantIdentifier }).lean();
  if (r2 && r2.dataId) return r2.dataId;
  // as fallback, try to find by placeId
  const r3 = await Restaurant.findOne({ placeId: restaurantIdentifier }).lean();
  if (r3 && r3.dataId) return r3.dataId;
  return null;
}

async function linkUserToRestaurant(userId, restaurantIdentifier) {
  const restaurantDataId = await resolveRestaurantDataId(restaurantIdentifier);
  if (!restaurantDataId) throw new Error('Restaurant introuvable');

  // Insert or return existing row
  const textInsert = `INSERT INTO user_restaurant_status (user_id, restaurant_mongo_id) VALUES ($1,$2)
    ON CONFLICT (user_id, restaurant_mongo_id) DO NOTHING RETURNING user_id, restaurant_mongo_id, status`;
  const resInsert = await db.query(textInsert, [userId, restaurantDataId]);
  if (resInsert.rowCount) return resInsert.rows[0];

  // already exists -> select
  const res = await db.query('SELECT user_id, restaurant_mongo_id, status FROM user_restaurant_status WHERE user_id = $1 AND restaurant_mongo_id = $2', [userId, restaurantDataId]);
  return res.rowCount ? res.rows[0] : null;
}

async function getUserRestaurants(userId) {
  const res = await db.query('SELECT restaurant_mongo_id, status FROM user_restaurant_status WHERE user_id = $1', [userId]);
  return res.rows;
}

async function updateStatus(userId, restaurantDataId, statuses) {
  const res = await db.query('UPDATE user_restaurant_status SET status = $3 WHERE user_id = $1 AND restaurant_mongo_id = $2 RETURNING user_id, restaurant_mongo_id, status', [userId, restaurantDataId, statuses]);
  return res.rowCount ? res.rows[0] : null;
}

module.exports = { resolveRestaurantDataId, linkUserToRestaurant, getUserRestaurants, updateStatus };

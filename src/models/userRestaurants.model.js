const db = require('../db/db-postgres');
const Restaurant = require('./restaurants.model');
const mongoose = require('mongoose');

/**
 * Modèle métier pour gérer la relation entre les utilisateurs Postgres et les restaurants Mongo.
 * Table Postgres : user_restaurant_status(user_id, restaurant_mongo_id, status text[])
 */

/**
 * Résout l'identifiant "dataId" d'un restaurant à partir de différents identifiants possibles :
 * - si c'est un ObjectId Mongo valide, on cherche par _id
 * - sinon on cherche par dataId
 * - en dernier recours on cherche par placeId
 * Retourne le dataId ou null si introuvable.
 */
async function resolveRestaurantDataId(restaurantIdentifier) {
  if (!restaurantIdentifier) return null;
  // si c'est un ObjectId valide, tenter de trouver par _id
  if (mongoose.Types.ObjectId.isValid(restaurantIdentifier)) {
    const r = await Restaurant.findById(restaurantIdentifier).lean();
    if (r && r.dataId) return r.dataId;
  }
  // sinon essayer de trouver directement par dataId
  const r2 = await Restaurant.findOne({ dataId: restaurantIdentifier }).lean();
  if (r2 && r2.dataId) return r2.dataId;
  // en dernier lieu, essayer par placeId
  const r3 = await Restaurant.findOne({ placeId: restaurantIdentifier }).lean();
  if (r3 && r3.dataId) return r3.dataId;
  return null;
}

/**
 * Lie un utilisateur à un restaurant (création de la ligne si nécessaire).
 * - userId : identifiant de l'utilisateur (Postgres)
 * - restaurantIdentifier : peut être _id Mongo, dataId ou placeId
 * Retourne la ligne (user_id, restaurant_mongo_id, status) ou lève une erreur si le restaurant est introuvable.
 */
async function linkUserToRestaurant(userId, restaurantIdentifier) {
  const restaurantDataId = await resolveRestaurantDataId(restaurantIdentifier);
  if (!restaurantDataId) throw new Error('Restaurant introuvable');

  // Insérer ou retourner la ligne existante
  const textInsert = `INSERT INTO user_restaurant_status (user_id, restaurant_mongo_id) VALUES ($1,$2)
    ON CONFLICT (user_id, restaurant_mongo_id) DO NOTHING RETURNING user_id, restaurant_mongo_id, status`;
  const resInsert = await db.query(textInsert, [userId, restaurantDataId]);
  if (resInsert.rowCount) return resInsert.rows[0];

  // si elle existe déjà -> sélectionner et retourner
  const res = await db.query('SELECT user_id, restaurant_mongo_id, status FROM user_restaurant_status WHERE user_id = $1 AND restaurant_mongo_id = $2', [userId, restaurantDataId]);
  return res.rowCount ? res.rows[0] : null;
}

/**
 * Récupère tous les restaurants liés à un utilisateur et leur statut.
 * - userId : identifiant de l'utilisateur
 * Retourne un tableau de lignes { restaurant_mongo_id, status }.
 */
async function getUserRestaurants(userId) {
  const res = await db.query('SELECT restaurant_mongo_id, status FROM user_restaurant_status WHERE user_id = $1', [userId]);
  return res.rows;
}

/**
 * Met à jour le statut d'un utilisateur pour un restaurant donné.
 * - userId : identifiant de l'utilisateur
 * - restaurantDataId : dataId du restaurant (valeur stockée dans la table)
 * - statuses : nouveau tableau de statuts (text[])
 * Retourne la ligne mise à jour ou null si aucune ligne correspondante.
 */
async function updateStatus(userId, restaurantDataId, statuses) {
  const res = await db.query('UPDATE user_restaurant_status SET status = $3 WHERE user_id = $1 AND restaurant_mongo_id = $2 RETURNING user_id, restaurant_mongo_id, status', [userId, restaurantDataId, statuses]);
  return res.rowCount ? res.rows[0] : null;
}

module.exports = { resolveRestaurantDataId, linkUserToRestaurant, getUserRestaurants, updateStatus };

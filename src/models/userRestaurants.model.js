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
 * Retourne la ligne complète ou lève une erreur si le restaurant est introuvable.
 */
async function linkUserToRestaurant(userId, restaurantIdentifier) {
  const restaurantDataId = await resolveRestaurantDataId(restaurantIdentifier);
  if (!restaurantDataId) throw new Error('Restaurant introuvable');

  // Insérer ou retourner la ligne existante
  const textInsert = `INSERT INTO user_restaurant_status (user_id, restaurant_id) VALUES ($1,$2)
    ON CONFLICT (user_id, restaurant_id) DO NOTHING 
    RETURNING id, user_id, restaurant_id, is_favorite, favorited_at, is_viewed, viewed_at, is_contacted, contacted_at`;
  const resInsert = await db.query(textInsert, [userId, restaurantDataId]);
  if (resInsert.rowCount) return resInsert.rows[0];

  // si elle existe déjà -> sélectionner et retourner
  const res = await db.query(
    'SELECT id, user_id, restaurant_id, is_favorite, favorited_at, is_viewed, viewed_at, is_contacted, contacted_at FROM user_restaurant_status WHERE user_id = $1 AND restaurant_id = $2', 
    [userId, restaurantDataId]
  );
  return res.rowCount ? res.rows[0] : null;
}

/**
 * Récupère tous les restaurants liés à un utilisateur et leur statut.
 * - userId : identifiant de l'utilisateur
 * Retourne un tableau de lignes avec tous les champs.
 */
async function getUserRestaurants(userId) {
  const res = await db.query(
    'SELECT id, user_id, restaurant_id, is_favorite, favorited_at, is_viewed, viewed_at, is_contacted, contacted_at FROM user_restaurant_status WHERE user_id = $1', 
    [userId]
  );
  return res.rows;
}

/**
 * Met à jour le statut favori d'un utilisateur pour un restaurant donné.
 * - userId : identifiant de l'utilisateur
 * - restaurantDataId : dataId du restaurant (valeur stockée dans la table)
 * - isFavorite : true pour ajouter aux favoris, false pour retirer
 * Retourne la ligne mise à jour ou null si aucune ligne correspondante.
 */
async function updateFavoriteStatus(userId, restaurantDataId, isFavorite) {
  const query = isFavorite
    ? 'UPDATE user_restaurant_status SET is_favorite = true, favorited_at = NOW() WHERE user_id = $1 AND restaurant_id = $2 RETURNING id, user_id, restaurant_id, is_favorite, favorited_at, is_viewed, viewed_at, is_contacted, contacted_at'
    : 'UPDATE user_restaurant_status SET is_favorite = false, favorited_at = NULL WHERE user_id = $1 AND restaurant_id = $2 RETURNING id, user_id, restaurant_id, is_favorite, favorited_at, is_viewed, viewed_at, is_contacted, contacted_at';
  
  const res = await db.query(query, [userId, restaurantDataId]);
  return res.rowCount ? res.rows[0] : null;
}

/**
 * Met à jour le statut de consultation d'un utilisateur pour un restaurant donné.
 * - userId : identifiant de l'utilisateur
 * - restaurantDataId : dataId du restaurant
 * - isViewed : true pour marquer comme consulté
 */
async function updateViewedStatus(userId, restaurantDataId, isViewed) {
  const query = isViewed
    ? 'UPDATE user_restaurant_status SET is_viewed = true, viewed_at = NOW() WHERE user_id = $1 AND restaurant_id = $2 RETURNING id, user_id, restaurant_id, is_favorite, favorited_at, is_viewed, viewed_at, is_contacted, contacted_at'
    : 'UPDATE user_restaurant_status SET is_viewed = false, viewed_at = NULL WHERE user_id = $1 AND restaurant_id = $2 RETURNING id, user_id, restaurant_id, is_favorite, favorited_at, is_viewed, viewed_at, is_contacted, contacted_at';
  
  const res = await db.query(query, [userId, restaurantDataId]);
  return res.rowCount ? res.rows[0] : null;
}

/**
 * Met à jour le statut de contact d'un utilisateur pour un restaurant donné.
 * - userId : identifiant de l'utilisateur
 * - restaurantDataId : dataId du restaurant
 * - isContacted : true pour marquer comme contacté
 */
async function updateContactedStatus(userId, restaurantDataId, isContacted) {
  const query = isContacted
    ? 'UPDATE user_restaurant_status SET is_contacted = true, contacted_at = NOW() WHERE user_id = $1 AND restaurant_id = $2 RETURNING id, user_id, restaurant_id, is_favorite, favorited_at, is_viewed, viewed_at, is_contacted, contacted_at'
    : 'UPDATE user_restaurant_status SET is_contacted = false, contacted_at = NULL WHERE user_id = $1 AND restaurant_id = $2 RETURNING id, user_id, restaurant_id, is_favorite, favorited_at, is_viewed, viewed_at, is_contacted, contacted_at';
  
  const res = await db.query(query, [userId, restaurantDataId]);
  return res.rowCount ? res.rows[0] : null;
}

module.exports = { 
  resolveRestaurantDataId, 
  linkUserToRestaurant, 
  getUserRestaurants, 
  updateFavoriteStatus,
  updateViewedStatus,
  updateContactedStatus
};

const db = require('../db/db-postgres');

// Table refresh_tokens attend les colonnes suivantes :
// id serial primary key, token text unique, user_id int references users(id), expires_at timestamptz, created_at timestamptz default now()

/**
 * Crée une entrée de refresh token en base.
 * @param {string} token - Le jeton de rafraîchissement.
 * @param {number} userId - L'ID de l'utilisateur propriétaire du token.
 * @param {string|Date} expiresAt - Date/heure d'expiration (timestamptz).
 * @returns {Promise<object>} - L'enregistrement inséré (id, token, user_id, expires_at, created_at).
 */
async function create(token, userId, expiresAt) {
  const text = `INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1,$2,$3) RETURNING id, token, user_id, expires_at, created_at`;
  const res = await db.query(text, [token, userId, expiresAt]);
  return res.rows[0];
}

/**
 * Recherche un refresh token par sa valeur.
 * @param {string} token - Le jeton à rechercher.
 * @returns {Promise<object|null>} - L'enregistrement trouvé ou null si aucun.
 */
async function findByToken(token) {
  const res = await db.query('SELECT id, token, user_id, expires_at, created_at FROM refresh_tokens WHERE token = $1', [token]);
  return res.rowCount ? res.rows[0] : null;
}

/**
 * Supprime un refresh token par sa valeur.
 * @param {string} token - Le jeton à supprimer.
 * @returns {Promise<boolean>} - true si une ligne a été supprimée, false sinon.
 */
async function deleteByToken(token) {
  const res = await db.query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
  return res.rowCount > 0;
}

/**
 * Supprime tous les refresh tokens d'un utilisateur donné.
 * @param {number} userId - L'ID de l'utilisateur.
 * @returns {Promise<number>} - Le nombre de lignes supprimées.
 */
async function deleteByUserId(userId) {
  const res = await db.query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);
  return res.rowCount;
}

module.exports = { create, findByToken, deleteByToken, deleteByUserId };

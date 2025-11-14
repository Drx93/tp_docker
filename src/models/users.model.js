const db = require('../db/db-postgres');

/**
 * Modèle User basé sur Postgres.
 * Colonnes : id (int), lastname, firstname, email, password_hash, role_id, created_at
 */

async function findAll({ q, limit = 50, offset = 0 } = {}) {
  // Retourne la vue publique des utilisateurs (exclut password_hash)
  const vals = [];
  let where = '';
  if (q) {
    // Recherche insensible à la casse sur lastname, firstname ou email
    vals.push(`%${q}%`);
    where = `WHERE lastname ILIKE $${vals.length} OR firstname ILIKE $${vals.length} OR email ILIKE $${vals.length}`;
  }
  // Ajout des paramètres LIMIT et OFFSET
  vals.push(limit);
  vals.push(offset);
  // Construire la requête en utilisant les index des paramètres
  const text = `SELECT id, lastname, firstname, email, role_id, created_at FROM users ${where} ORDER BY id LIMIT $${vals.length-1} OFFSET $${vals.length}`;
  const res = await db.query(text, vals);
  return res.rows;
}

async function findById(id) {
  // Vue publique d'un utilisateur par id (pas de password_hash)
  const res = await db.query('SELECT id, lastname, firstname, email, role_id, created_at FROM users WHERE id = $1', [id]);
  return res.rowCount ? res.rows[0] : null;
}

async function findByEmail(email) {
  // Retourne la ligne complète (inclut password_hash) pour l'authentification
  const res = await db.query('SELECT id, lastname, firstname, email, role_id, password_hash, created_at FROM users WHERE email = $1', [email]);
  return res.rowCount ? res.rows[0] : null;
}

async function createOne({ lastname, firstname, email, password_hash, role_id = null }) {
  // Insère un nouvel utilisateur et retourne la vue publique du nouvel enregistrement
  const text = `INSERT INTO users (lastname, firstname, email, password_hash, role_id) VALUES ($1,$2,$3,$4,$5) RETURNING id, lastname, firstname, email, role_id, created_at`;
  const vals = [lastname, firstname, email, password_hash, role_id];
  const res = await db.query(text, vals);
  return res.rows[0];
}

async function updateOne(id, dto) {
  // Construction dynamique de la clause SET selon les champs présents dans dto
  const keys = [];
  const vals = [];
  let idx = 1;
  if (dto.lastname !== undefined) { keys.push(`lastname=$${idx++}`); vals.push(dto.lastname); }
  if (dto.firstname !== undefined) { keys.push(`firstname=$${idx++}`); vals.push(dto.firstname); }
  if (dto.email !== undefined) { keys.push(`email=$${idx++}`); vals.push(dto.email); }
  if (dto.password_hash !== undefined) { keys.push(`password_hash=$${idx++}`); vals.push(dto.password_hash); }
  // Si rien à mettre à jour, retourner l'utilisateur existant
  if (!keys.length) return await findById(id);
  // Ajouter l'id en dernier paramètre pour la clause WHERE
  vals.push(id);
  const text = `UPDATE users SET ${keys.join(', ')} WHERE id = $${vals.length} RETURNING id, lastname, firstname, email, role_id, created_at`;
  const res = await db.query(text, vals);
  return res.rowCount ? res.rows[0] : null;
}

async function deleteOne(id) {
  // Supprime l'utilisateur par id, retourne true si une ligne a été supprimée
  const res = await db.query('DELETE FROM users WHERE id = $1', [id]);
  return res.rowCount > 0;
}

module.exports = { findAll, findById, findByEmail, createOne, updateOne, deleteOne };

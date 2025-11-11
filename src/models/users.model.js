const db = require('../db/db-postgres');

/**
 * User model backed by Postgres.
 * Columns: id (int), lastname, firstname, email, password_hash, created_at
 */

async function findAll({ q, limit = 50, offset = 0 } = {}) {
  // Return public user fields (exclude password_hash)
  const vals = [];
  let where = '';
  if (q) {
    vals.push(`%${q}%`);
    where = `WHERE lastname ILIKE $${vals.length} OR firstname ILIKE $${vals.length} OR email ILIKE $${vals.length}`;
  }
  vals.push(limit);
  vals.push(offset);
  const text = `SELECT id, lastname, firstname, email, role_id, created_at FROM users ${where} ORDER BY id LIMIT $${vals.length-1} OFFSET $${vals.length}`;
  const res = await db.query(text, vals);
  return res.rows;
}

async function findById(id) {
  // Public view (no password_hash)
  const res = await db.query('SELECT id, lastname, firstname, email, role_id, created_at FROM users WHERE id = $1', [id]);
  return res.rowCount ? res.rows[0] : null;
}

async function findByEmail(email) {
  // Return full row including password_hash for authentication
  const res = await db.query('SELECT id, lastname, firstname, email, role_id, password_hash, created_at FROM users WHERE email = $1', [email]);
  return res.rowCount ? res.rows[0] : null;
}

async function createOne({ lastname, firstname, email, password_hash, role_id = null }) {
  const text = `INSERT INTO users (lastname, firstname, email, password_hash, role_id) VALUES ($1,$2,$3,$4,$5) RETURNING id, lastname, firstname, email, role_id, created_at`;
  const vals = [lastname, firstname, email, password_hash, role_id];
  const res = await db.query(text, vals);
  return res.rows[0];
}

async function updateOne(id, dto) {
  // Build dynamic set
  const keys = [];
  const vals = [];
  let idx = 1;
  if (dto.lastname !== undefined) { keys.push(`lastname=$${idx++}`); vals.push(dto.lastname); }
  if (dto.firstname !== undefined) { keys.push(`firstname=$${idx++}`); vals.push(dto.firstname); }
  if (dto.email !== undefined) { keys.push(`email=$${idx++}`); vals.push(dto.email); }
  if (dto.password_hash !== undefined) { keys.push(`password_hash=$${idx++}`); vals.push(dto.password_hash); }
  if (!keys.length) return await findById(id);
  vals.push(id);
  const text = `UPDATE users SET ${keys.join(', ')} WHERE id = $${vals.length} RETURNING id, lastname, firstname, email, role_id, created_at`;
  const res = await db.query(text, vals);
  return res.rowCount ? res.rows[0] : null;
}

async function deleteOne(id) {
  const res = await db.query('DELETE FROM users WHERE id = $1', [id]);
  return res.rowCount > 0;
}

module.exports = { findAll, findById, findByEmail, createOne, updateOne, deleteOne };

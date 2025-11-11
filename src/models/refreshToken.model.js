const db = require('../db/db-postgres');

// refresh_tokens table expected columns:
// id serial primary key, token text unique, user_id int references users(id), expires_at timestamptz, created_at timestamptz default now()

async function create(token, userId, expiresAt) {
  const text = `INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1,$2,$3) RETURNING id, token, user_id, expires_at, created_at`;
  const res = await db.query(text, [token, userId, expiresAt]);
  return res.rows[0];
}

async function findByToken(token) {
  const res = await db.query('SELECT id, token, user_id, expires_at, created_at FROM refresh_tokens WHERE token = $1', [token]);
  return res.rowCount ? res.rows[0] : null;
}

async function deleteByToken(token) {
  const res = await db.query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
  return res.rowCount > 0;
}

async function deleteByUserId(userId) {
  const res = await db.query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);
  return res.rowCount;
}

module.exports = { create, findByToken, deleteByToken, deleteByUserId };

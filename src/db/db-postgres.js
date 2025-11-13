const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('DATABASE_URL not set in environment; Postgres pool will not be created.');
}

const pool = connectionString ? new Pool({ connectionString }) : null;

async function query(text, params) {
  if (!pool) throw new Error('Postgres pool not initialized (DATABASE_URL missing)');
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  // console.debug('executed query', { text, duration, rows: res.rowCount });
  return res;
}

async function testConnection() {
  if (!pool) return false;
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (e) {
    console.error('Postgres connection test failed:', e.message);
    return false;
  }
}

module.exports = { pool, query, testConnection };

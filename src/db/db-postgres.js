// Module de connexion à Postgres en utilisant le pool de 'pg'.
// Charge les variables d'environnement depuis un fichier .env.
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config(); // charge process.env depuis .env

// Récupère la chaîne de connexion PostgreSQL depuis la variable d'environnement.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Avertissement si DATABASE_URL n'est pas défini : le pool ne sera pas créé.
  console.warn('DATABASE_URL not set in environment; Postgres pool will not be created.');
}

// Crée un pool de connexions si la chaîne de connexion est disponible, sinon null.
const pool = connectionString ? new Pool({ connectionString }) : null;

/**
 * Exécute une requête SQL via le pool.
 * Lève une erreur si le pool n'a pas été initialisé (DATABASE_URL manquante).
 * Mesure la durée d'exécution pour debug/perf.
 * @param {string} text - requête SQL
 * @param {Array} params - paramètres de la requête
 */
async function query(text, params) {
  if (!pool) throw new Error('Postgres pool not initialized (DATABASE_URL missing)');
  const start = Date.now(); // timestamp de début
  const res = await pool.query(text, params);
  const duration = Date.now() - start; // durée en ms
  // console.debug('executed query', { text, duration, rows: res.rowCount }); // débogage optionnel
  return res;
}

/**
 * Teste la connexion à la base en exécutant une requête simple.
 * Retourne true si la requête réussit, false sinon (ou si pas de pool).
 */
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

// Exporte le pool, la fonction query et la fonction de test de connexion.
module.exports = { pool, query, testConnection };

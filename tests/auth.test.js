const request = require('supertest');
const app = require('../src/server');
const db = require('../src/db/db-postgres');

// Suite de tests pour l'authentification et le flux utilisateurs
describe('Auth + users flow', () => {
  // id du rôle "admin" inséré en seed
  let roleAdminId;
  // utilisateur créé durant les tests
  let createdUser;
  // token d'accès récupéré après login
  let accessToken;

  beforeAll(async () => {
    // Nettoyage des tables avant les tests (l'ordre importe à cause des FK)
    await db.query('DELETE FROM users');
    await db.query('DELETE FROM roles');

    // Insérer les rôles nécessaires pour les tests
    await db.query("INSERT INTO roles(name) VALUES ($1),($2)", ['admin','user']);
    // Récupérer l'id du rôle admin pour l'utiliser lors de la création d'utilisateur
    const r = await db.query("SELECT id FROM roles WHERE name = $1", ['admin']);
    roleAdminId = r.rows[0].id;
  });

  afterAll(async () => {
    // Nettoyage après les tests et fermeture du pool de connexions si présent
    await db.query('DELETE FROM users');
    await db.query('DELETE FROM roles');
    if (db.pool) await db.pool.end();
  });

  test('create user (POST /api/users) should return 201', async () => {
    // Création d'un utilisateur via l'API
    const res = await request(app)
      .post('/api/users')
      .send({ lastname: 'Dupont', firstname: 'Alice', email: 'alice@example.com', password: 'secret123', role_id: roleAdminId })
      .set('Accept', 'application/json');
    // Vérifier que la création a réussi et que la réponse contient l'id et l'email
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('alice@example.com');
    createdUser = res.body;
  });

  test('login (POST /auth/login) should return tokens', async () => {
    // Connexion avec l'utilisateur créé pour récupérer le token d'accès
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'alice@example.com', password: 'secret123' });
    expect(res.status).toBe(200);
    // Vérifier la présence d'un accessToken dans la réponse
    expect(res.body).toHaveProperty('accessToken');
    accessToken = res.body.accessToken;
  });

  test('access protected route GET /api/users with Bearer token', async () => {
    // Accès à une route protégée en passant le token Bearer
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${accessToken}`);
    // Vérifier accès autorisé et structure de la réponse
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('total');
    expect(Array.isArray(res.body.data)).toBe(true);
    // S'assurer que l'utilisateur créé figure dans les résultats
    const found = res.body.data.find(u => u.email === 'alice@example.com');
    expect(found).toBeTruthy();
  });

  // Refresh/logout flow removed: client must re-login after access token expiry.
});

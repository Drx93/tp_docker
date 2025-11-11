const request = require('supertest');
const app = require('../src/server');
const db = require('../src/db/db-postgres');

describe('Auth + users flow', () => {
  let roleAdminId;
  let createdUser;
  let accessToken;

  beforeAll(async () => {
    // Clean tables (order matters due to FK)
    await db.query('DELETE FROM users');
    await db.query('DELETE FROM roles');

    // Seed roles
    await db.query("INSERT INTO roles(name) VALUES ($1),($2)", ['admin','user']);
    const r = await db.query("SELECT id FROM roles WHERE name = $1", ['admin']);
    roleAdminId = r.rows[0].id;
  });

  afterAll(async () => {
    // cleanup
    await db.query('DELETE FROM users');
    await db.query('DELETE FROM roles');
    if (db.pool) await db.pool.end();
  });

  test('create user (POST /api/users) should return 201', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ lastname: 'Dupont', firstname: 'Alice', email: 'alice@example.com', password: 'secret123', role_id: roleAdminId })
      .set('Accept', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('alice@example.com');
    createdUser = res.body;
  });

  test('login (POST /auth/login) should return tokens', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'alice@example.com', password: 'secret123' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    accessToken = res.body.accessToken;
  });

  test('access protected route GET /api/users with Bearer token', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('total');
    expect(Array.isArray(res.body.data)).toBe(true);
    const found = res.body.data.find(u => u.email === 'alice@example.com');
    expect(found).toBeTruthy();
  });

  // Refresh/logout flow removed: client must re-login after access token expiry.
});

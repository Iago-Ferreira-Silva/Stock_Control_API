const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
require('./setup');

const token = jwt.sign(
  { email: process.env.ADMIN_EMAIL },
  process.env.JWT_SECRET || 'segredo_troque_em_producao',
  { expiresIn: '1h' }
);

const auth = { Authorization: `Bearer ${token}` };

describe('GET /logs', () => {
  it('deve retornar logs de uma data válida', async () => {
    const hoje = new Date().toISOString().split('T')[0];

    const res = await request(app)
      .get(`/logs?data=${hoje}`)
      .set(auth);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('deve retornar 400 sem parâmetro data', async () => {
    const res = await request(app).get('/logs').set(auth);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('erro');
  });

  it('deve retornar 400 com formato de data inválido', async () => {
    const res = await request(app)
      .get('/logs?data=18-04-2026')
      .set(auth);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('erro');
  });

  it('deve retornar 401 sem token', async () => {
    const hoje = new Date().toISOString().split('T')[0];
    const res = await request(app).get(`/logs?data=${hoje}`);
    expect(res.status).toBe(401);
  });
});
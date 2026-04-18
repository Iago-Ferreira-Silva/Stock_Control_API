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

// Coordenadas reais: Crato → Fortaleza
const crato = { lat1: -7.2306, lon1: -39.3167 };
const fortaleza = { lat2: -3.7172, lon2: -38.5431 };

describe('GET /distancia', () => {
  it('deve calcular a distância entre dois pontos', async () => {
    const res = await request(app)
      .get('/distancia')
      .set(auth)
      .query({ ...crato, ...fortaleza });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('distancia');
    expect(res.body.distancia).toHaveProperty('km');
    expect(res.body.distancia).toHaveProperty('metros');
    expect(res.body.distancia.km).toBeGreaterThan(0);
  });

  it('deve retornar 0 km para o mesmo ponto', async () => {
    const res = await request(app)
      .get('/distancia')
      .set(auth)
      .query({ lat1: -7.2306, lon1: -39.3167, lat2: -7.2306, lon2: -39.3167 });

    expect(res.status).toBe(200);
    expect(res.body.distancia.km).toBe(0);
  });

  it('deve retornar 400 sem todos os parâmetros', async () => {
    const res = await request(app)
      .get('/distancia')
      .set(auth)
      .query({ lat1: -7.2306, lon1: -39.3167 }); // faltando lat2 e lon2

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('erro');
  });

  it('deve retornar 400 com coordenadas inválidas', async () => {
    const res = await request(app)
      .get('/distancia')
      .set(auth)
      .query({ lat1: 'abc', lon1: -39.3167, lat2: -3.7172, lon2: -38.5431 });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('erro');
  });

  it('deve retornar 400 com latitude fora do intervalo', async () => {
    const res = await request(app)
      .get('/distancia')
      .set(auth)
      .query({ lat1: 200, lon1: -39.3167, lat2: -3.7172, lon2: -38.5431 });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('erro');
  });

  it('deve retornar 401 sem token', async () => {
    const res = await request(app)
      .get('/distancia')
      .query({ ...crato, ...fortaleza });

    expect(res.status).toBe(401);
  });
});
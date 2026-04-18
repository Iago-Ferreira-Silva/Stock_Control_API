const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const Item = require('../src/models/item');
require('./setup');

// Gera um token válido direto, sem precisar passar pelo fluxo de 2FA
const token = jwt.sign(
  { email: process.env.ADMIN_EMAIL },
  process.env.JWT_SECRET || 'segredo_troque_em_producao',
  { expiresIn: '1h' }
);

const auth = { Authorization: `Bearer ${token}` };

// Limpa os itens de teste após cada teste para não interferir nos próximos
afterEach(async () => {
  await Item.deleteMany({ nome: /^TESTE_JEST/ });
});

describe('GET /itens', () => {
  it('deve listar itens com token válido', async () => {
    const res = await request(app).get('/itens').set(auth);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('deve retornar 401 sem token', async () => {
    const res = await request(app).get('/itens');
    expect(res.status).toBe(401);
  });
});

describe('POST /itens', () => {
  it('deve criar um item com dados válidos', async () => {
    const res = await request(app)
      .post('/itens')
      .set(auth)
      .send({ nome: 'TESTE_JEST Monitor', preco: 899.90 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.nome).toBe('TESTE_JEST Monitor');
    expect(res.body.preco).toBe(899.90);
  });

  it('deve retornar 400 sem nome', async () => {
    const res = await request(app)
      .post('/itens')
      .set(auth)
      .send({ preco: 100 });

    expect(res.status).toBe(400);
  });

  it('deve retornar 400 sem preco', async () => {
    const res = await request(app)
      .post('/itens')
      .set(auth)
      .send({ nome: 'TESTE_JEST Item' });

    expect(res.status).toBe(400);
  });

  it('deve retornar 400 com preco negativo', async () => {
    const res = await request(app)
      .post('/itens')
      .set(auth)
      .send({ nome: 'TESTE_JEST Item', preco: -10 });

    expect(res.status).toBe(400);
  });
});

describe('GET /itens/:id', () => {
  it('deve retornar um item pelo ID', async () => {
    const criado = await Item.create({ nome: 'TESTE_JEST Busca', preco: 50 });

    const res = await request(app)
      .get(`/itens/${criado._id}`)
      .set(auth);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(criado._id.toString());
  });

  it('deve retornar 404 para ID inexistente', async () => {
    const res = await request(app)
      .get('/itens/6627a3f8c21d09b4e76f2c58')
      .set(auth);

    expect(res.status).toBe(404);
  });

  it('deve retornar 400 para ID inválido', async () => {
    const res = await request(app)
      .get('/itens/id-invalido')
      .set(auth);

    expect(res.status).toBe(400);
  });
});

describe('PUT /itens/:id', () => {
  it('deve atualizar um item', async () => {
    const criado = await Item.create({ nome: 'TESTE_JEST Antigo', preco: 100 });

    const res = await request(app)
      .put(`/itens/${criado._id}`)
      .set(auth)
      .send({ nome: 'TESTE_JEST Novo', preco: 200 });

    expect(res.status).toBe(200);
    expect(res.body.nome).toBe('TESTE_JEST Novo');
    expect(res.body.preco).toBe(200);
  });

  it('deve retornar 400 sem nenhum campo para atualizar', async () => {
    const criado = await Item.create({ nome: 'TESTE_JEST Vazio', preco: 100 });

    const res = await request(app)
      .put(`/itens/${criado._id}`)
      .set(auth)
      .send({});

    expect(res.status).toBe(400);
  });
});

describe('DELETE /itens/:id', () => {
  it('deve deletar um item', async () => {
    const criado = await Item.create({ nome: 'TESTE_JEST Deletar', preco: 10 });

    const res = await request(app)
      .delete(`/itens/${criado._id}`)
      .set(auth);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('mensagem');
  });

  it('deve retornar 404 para ID inexistente', async () => {
    const res = await request(app)
      .delete('/itens/6627a3f8c21d09b4e76f2c58')
      .set(auth);

    expect(res.status).toBe(404);
  });
});
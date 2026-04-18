const request = require('supertest');
const app = require('../src/app');
require('./setup');

// Mock do Resend para não enviar email de verdade durante os testes
jest.mock('resend', () => {
  return {
    Resend: jest.fn().mockImplementation(() => ({
      emails: {
        send: jest.fn().mockResolvedValue({ id: 'mock-email-id' }),
      },
    })),
  };
});

describe('POST /logar', () => {
  it('deve retornar mensagem de código enviado com credenciais corretas', async () => {
    const res = await request(app)
      .post('/logar')
      .send({ email: process.env.ADMIN_EMAIL, senha: '123456' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('mensagem');
  });

  it('deve retornar 401 com senha incorreta', async () => {
    const res = await request(app)
      .post('/logar')
      .send({ email: process.env.ADMIN_EMAIL, senha: 'senhaerrada' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('erro', 'Credenciais inválidas');
  });

  it('deve retornar 401 com email incorreto', async () => {
    const res = await request(app)
      .post('/logar')
      .send({ email: 'naoexiste@email.com', senha: '123456' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('erro', 'Credenciais inválidas');
  });

  it('deve retornar 400 quando email não for informado', async () => {
    const res = await request(app)
      .post('/logar')
      .send({ senha: '123456' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('erro');
  });

  it('deve retornar 400 quando senha não for informada', async () => {
    const res = await request(app)
      .post('/logar')
      .send({ email: process.env.ADMIN_EMAIL });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('erro');
  });
});

describe('POST /logar/verificar', () => {
  it('deve retornar 401 com código inválido', async () => {
    const res = await request(app)
      .post('/logar/verificar')
      .send({ email: process.env.ADMIN_EMAIL, codigo: '000000' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('erro', 'Código inválido ou expirado');
  });

  it('deve retornar 400 quando código não for informado', async () => {
    const res = await request(app)
      .post('/logar/verificar')
      .send({ email: process.env.ADMIN_EMAIL });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('erro');
  });
});
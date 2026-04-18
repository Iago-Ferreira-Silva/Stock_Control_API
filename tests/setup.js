const mongoose = require('mongoose');
const conectar = require('../src/database/conexao');

// Conecta ao banco ANTES de todos os testes rodarem
beforeAll(async () => {
  await conectar();
});

// Desconecta do banco DEPOIS de todos os testes terminarem
afterAll(async () => {
  await mongoose.disconnect();
});
require('dotenv').config();

const mongoose = require('mongoose');
const Usuario = require('../models/usuario');

// Este script atualiza o email do admin no banco.
// Execute UMA VEZ com: node src/scripts/atualizarAdmin.js
// Depois pode apagar ou guardar — não precisa rodar de novo.

const atualizarAdmin = async () => {
  try {
    if (!process.env.ADMIN_EMAIL) {
      console.error('Erro: ADMIN_EMAIL não definido no .env');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB conectado ✅');

    await Usuario.updateOne(
      { email: 'admin@email.com' },       // email antigo
      { email: process.env.ADMIN_EMAIL }, // email novo vindo do .env
    );

    console.log('Email atualizado com sucesso ✅');
    console.log(`Novo email: ${process.env.ADMIN_EMAIL}`);
    console.log('Senha continua: 123456');
  } catch (erro) {
    console.error('Erro ao atualizar admin:', erro.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

atualizarAdmin();
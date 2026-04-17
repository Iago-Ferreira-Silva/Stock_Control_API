require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');

// Este script cria o usuário admin no banco com a senha criptografada.
// Execute UMA VEZ com: node src/scripts/criarAdmin.js
// Depois pode apagar ou guardar — não precisa rodar de novo.

const criarAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB conectado ✅');

    // Verifica se o admin já existe para não duplicar
    const jaExiste = await Usuario.findOne({ email: 'admin@email.com' });
    if (jaExiste) {
      console.log('Usuário admin já existe no banco. Nada foi criado.');
      process.exit(0);
    }

    // O número 10 é o "salt rounds" — define o quanto o hash é forte.
    // 10 é o padrão da indústria: seguro e rápido o suficiente.
    const senhaHash = await bcrypt.hash('123456', 10);

    await Usuario.create({
      email: 'admin@email.com',
      senha: senhaHash,
    });

    console.log('Usuário admin criado com sucesso ✅');
    console.log('Email: admin@email.com');
    console.log('Senha: 123456');
  } catch (erro) {
    console.error('Erro ao criar admin:', erro.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

criarAdmin();
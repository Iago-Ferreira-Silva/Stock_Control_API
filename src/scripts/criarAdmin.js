require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');

const criarAdmin = async () => {
  try {
    const emailAdmin = process.env.ADMIN_EMAIL;
    const senhaAdmin = process.env.ADMIN_PASSWORD;
    const mongoUri = process.env.MONGODB_URI;

    if (!emailAdmin || !senhaAdmin || !mongoUri) {
      throw new Error('Variáveis ADMIN_EMAIL, ADMIN_PASSWORD ou MONGODB_URI não definidas.');
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB conectado');

    const jaExiste = await Usuario.findOne({ email: emailAdmin });

    if (jaExiste) {
      console.log('Admin já existe. Nada foi criado.');
      return;
    }

    const senhaHash = await bcrypt.hash(senhaAdmin, 10);

    await Usuario.create({
      email: emailAdmin,
      senha: senhaHash,
    });

    console.log('Usuário admin criado com sucesso');
  } catch (erro) {
    console.error('Erro ao criar admin:', erro.message);
  } finally {
    await mongoose.disconnect();
  }
};

criarAdmin();
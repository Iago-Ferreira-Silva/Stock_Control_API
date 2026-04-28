require('dotenv').config();

const mongoose = require('mongoose');
const Usuario = require('../models/usuario');

const atualizarAdmin = async () => {
  try {
    const emailAntigo = process.env.ADMIN_EMAIL_OLD;
    const emailNovo = process.env.ADMIN_EMAIL;
    const mongoUri = process.env.MONGODB_URI;

    if (!emailAntigo || !emailNovo || !mongoUri) {
      throw new Error('Variáveis ADMIN_EMAIL_OLD, ADMIN_EMAIL ou MONGODB_URI não definidas.');
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB conectado');

    const resultado = await Usuario.updateOne(
      { email: emailAntigo },
      { email: emailNovo }
    );

    if (resultado.matchedCount === 0) {
      console.log('Nenhum usuário encontrado com o email antigo.');
      return;
    }

    console.log('Email do admin atualizado com sucesso.');
    console.log(`Novo email: ${emailNovo}`);
  } catch (erro) {
    console.error('Erro ao atualizar admin:', erro.message);
  } finally {
    await mongoose.disconnect();
  }
};

atualizarAdmin();
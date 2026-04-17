const mongoose = require('mongoose');

// Essa função conecta ao MongoDB usando a string do .env
const conectar = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB conectado com sucesso ✅');
  } catch (erro) {
    console.error('Erro ao conectar ao MongoDB:', erro.message);
    process.exit(1); // Encerra o servidor se não conseguir conectar
  }
};

module.exports = conectar;
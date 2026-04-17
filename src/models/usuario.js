const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'O email é obrigatório'],
      unique: true,   // Não permite dois usuários com o mesmo email
      trim: true,
      lowercase: true,
    },
    senha: {
      type: String,
      required: [true, 'A senha é obrigatória'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Usuario', usuarioSchema);
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'O nome é obrigatório'],
      trim: true,
    },
    preco: {
      type: Number,
      required: [true, 'O preço é obrigatório'],
      min: [0.01, 'O preço deve ser maior que zero'],
    },
    imagem: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Item', itemSchema);
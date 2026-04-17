const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'O nome é obrigatório'],
      trim: true, // Remove espaços do início e fim automaticamente
    },
    preco: {
      type: Number,
      required: [true, 'O preço é obrigatório'],
      min: [0.01, 'O preço deve ser maior que zero'],
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
  }
);

// "Item" vira a coleção "items" no MongoDB
module.exports = mongoose.model('Item', itemSchema);
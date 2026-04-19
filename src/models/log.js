const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    rota: {
      type: String,
      required: true,
    },
    metodo: {
      type: String,
      required: true,
    },
  },
  {
    // timestamps: true cria os campos createdAt e updatedAt automaticamente.
    timestamps: true,
  },
);

module.exports = mongoose.model('Log', logSchema);
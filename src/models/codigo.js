const mongoose = require('mongoose');

const codigoSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  codigo: {
    type: String,
    required: true,
  },
  expiraEm: {
    type: Date,
    required: true,
  },
});

// O MongoDB deleta automaticamente o documento quando a data de expiração passar.
// Isso evita acúmulo de códigos velhos no banco sem precisar de um cron job.
codigoSchema.index({ expiraEm: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Codigo', codigoSchema);
const Log = require('../models/log');

module.exports = async (req, res, next) => {
  try {
    // Log.create salva no MongoDB — o createdAt é gerado automaticamente
    // pelo timestamps do Schema, sempre em UTC (padrão do Mongoose)
    await Log.create({
      rota: req.originalUrl,
      metodo: req.method,
    });
  } catch (erro) {
    // Se o log falhar, não derrubamos a requisição principal por isso
    console.error('[LOGGER] Erro ao salvar log:', erro.message);
  }

  next();
};
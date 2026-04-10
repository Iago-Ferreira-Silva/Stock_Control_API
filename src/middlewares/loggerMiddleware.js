const logs = require('../data/logs');

// Registra automaticamente toda requisição que chega na API
module.exports = (req, res, next) => {
  logs.push({
    rota: req.originalUrl,
    metodo: req.method,
    data: new Date().toISOString(), // Formato: "2025-04-10T14:30:00.000Z"
  });

  next(); // Continua para o próximo middleware ou rota
};
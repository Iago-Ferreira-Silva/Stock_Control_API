const logs = require('../data/logs');

module.exports = (req, res, next) => {
  logs.push({
    rota: req.originalUrl,
    metodo: req.method,
    data: new Date().toISOString()
  });

  next();
};
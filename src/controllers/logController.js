const logs = require('../data/logs');

exports.buscarPorData = (req, res) => {
  const { data } = req.query;

  const filtrados = logs.filter(log =>
    log.data.startsWith(data)
  );

  res.json(filtrados);
};
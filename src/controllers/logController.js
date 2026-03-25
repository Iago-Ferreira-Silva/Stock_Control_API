const logs = require('../data/logs');

exports.buscarPorData = (req, res) => {
  const { data } = req.query;

  if (!data) {
    return res.status(400).json({ erro: "Informe a data no formato YYYY-MM-DD" });
  }

  const filtrados = logs.filter(log => {
    const dataLog = new Date(log.data).toISOString().split('T')[0];
    return dataLog === data;
  });

  console.log(logs);

  res.json(filtrados);
};
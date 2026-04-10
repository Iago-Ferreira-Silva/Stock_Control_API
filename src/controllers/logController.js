const logs = require('../data/logs');

exports.buscarPorData = (req, res) => {
  const { data } = req.query;

  if (!data) {
    return res.status(400).json({ erro: 'Informe a data no formato YYYY-MM-DD' });
  }

  // Valida o formato da data antes de filtrar, evitando resultados inesperados
  const formatoValido = /^\d{4}-\d{2}-\d{2}$/.test(data);
  if (!formatoValido) {
    return res.status(400).json({ erro: 'Formato de data inválido. Use YYYY-MM-DD' });
  }

  const filtrados = logs.filter(log => {
    // Pega só a parte da data (YYYY-MM-DD) e compara com o parâmetro recebido
    const dataLog = new Date(log.data).toISOString().split('T')[0];
    return dataLog === data;
  });

  res.json(filtrados);
};
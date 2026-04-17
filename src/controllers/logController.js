const Log = require('../models/log');

exports.buscarPorData = async (req, res) => {
  const { data } = req.query;

  if (!data) {
    return res.status(400).json({ erro: 'Informe a data no formato YYYY-MM-DD' });
  }

  const formatoValido = /^\d{4}-\d{2}-\d{2}$/.test(data);
  if (!formatoValido) {
    return res.status(400).json({ erro: 'Formato de data inválido. Use YYYY-MM-DD' });
  }

  try {
    const inicio = new Date(`${data}T03:00:00.000Z`);
    const fim = new Date(inicio);
    fim.setDate(fim.getDate() + 1); // avança um dia

    const logs = await Log.find({
      createdAt: { $gte: inicio, $lt: fim },
    }).sort({ createdAt: -1 }); // mais recentes primeiro

    res.json(logs);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar logs' });
  }
};
module.exports = (req, res, next) => {
  const diaDaSemana = new Date().getDay(); // 0 = domingo, 6 = sábado

  if (diaDaSemana === 0 || diaDaSemana === 6) {
    return res.status(403).json({
      erro: 'Acesso permitido apenas de segunda a sexta-feira',
    });
  }

  next();
};
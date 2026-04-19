module.exports = (req, res, next) => {
  // Durante os testes, ignora o bloqueio de fim de semana
  if (process.env.NODE_ENV === 'test') return next();

  const diaDaSemana = new Date().getDay();

  if (diaDaSemana === 0 || diaDaSemana === 6) {
    return res.status(403).json({
      erro: 'Acesso permitido apenas de segunda a sexta-feira',
    });
  }

  next();
};
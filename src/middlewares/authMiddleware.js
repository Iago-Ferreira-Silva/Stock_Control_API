const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_troque_em_producao';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Aceita token via query string para suportar o player de vídeo HTML5
  // O elemento <video> não permite enviar headers customizados
  const tokenQuery = req.query.token;

  const token = tokenQuery || (authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

  if (!token) {
    return res.status(401).json({
      erro: 'Token não fornecido ou mal formatado. Use: Bearer <token>',
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuario   = payload;
    next();
  } catch (err) {
    const mensagem =
      err.name === 'TokenExpiredError'
        ? 'Token expirado. Faça login novamente'
        : 'Token inválido';

    return res.status(401).json({ erro: mensagem });
  }
};
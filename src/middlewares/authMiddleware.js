const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_troque_em_producao';

// Este middleware é chamado antes de qualquer rota protegida.
// Ele lê o token do cabeçalho Authorization e verifica se é válido.
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // O padrão da indústria é enviar: Authorization: Bearer <token>
  // Sem o "Bearer ", o token não seria extraído corretamente antes.
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token não fornecido ou mal formatado. Use: Bearer <token>' });
  }

  // Separa "Bearer " do token em si
  const token = authHeader.split(' ')[1];

  try {
    // jwt.verify valida a assinatura e a validade (expiresIn)
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuario = payload; // Disponibiliza o payload para os controllers, se precisar
    next();
  } catch (err) {
    // TokenExpiredError = token expirou | JsonWebTokenError = token inválido/adulterado
    const mensagem = err.name === 'TokenExpiredError'
      ? 'Token expirado. Faça login novamente'
      : 'Token inválido';

    return res.status(401).json({ erro: mensagem });
  }
};
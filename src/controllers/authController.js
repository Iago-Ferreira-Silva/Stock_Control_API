const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_troque_em_producao';

// Usuário mockado
const USUARIO_MOCK = {
  email: 'admin@email.com',
  senha: '123456',
};

exports.login = (req, res) => {
  const { email, senha } = req.body;

  // Valida se os campos foram enviados
  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
  }

  // Valida as credenciais
  if (email !== USUARIO_MOCK.email || senha !== USUARIO_MOCK.senha) {
    return res.status(401).json({ erro: 'Credenciais inválidas' });
  }

  // Gera o token com validade de 1 hora
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

  return res.json({ token });
};
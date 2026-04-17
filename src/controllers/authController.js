const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_troque_em_producao';

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
  }

  try {
    // Busca o usuário no banco pelo email
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      // Mesma mensagem para email errado e senha errada
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    // bcrypt.compare compara a senha digitada com o hash salvo no banco
    // Ela retorna true se bater, false se não bater — nunca descriptografa
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ email: usuario.email }, JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao realizar login' });
  }
};
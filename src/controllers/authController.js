const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const Codigo = require('../models/codigo');
const { enviarCodigo } = require('../services/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_troque_em_producao';

// Valida email e senha. Se correto, envia código por email.
exports.login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
  }

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    // Gera um código aleatório de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    // Salva o código no banco com validade de 10 minutos
    // Se já existia um código para esse email, deleta antes de criar o novo
    await Codigo.deleteMany({ email });
    await Codigo.create({
      email,
      codigo,
      expiraEm: new Date(Date.now() + 10 * 60 * 1000), // agora + 10 minutos
    });

    // Envia o código por email via Resend
    await enviarCodigo(email, codigo);

    return res.json({
      mensagem: 'Código de verificação enviado para o seu email',
    });
  } catch (erro) {
    console.error('[LOGIN]', erro.message);
    res.status(500).json({ erro: 'Erro ao realizar login' });
  }
};

// Recebe o código enviado por email. Se válido, retorna o token JWT.
exports.verificarCodigo = async (req, res) => {
  const { email, codigo } = req.body;

  if (!email || !codigo) {
    return res.status(400).json({ erro: 'Email e código são obrigatórios' });
  }

  try {
    const registro = await Codigo.findOne({ email, codigo });

    if (!registro) {
      return res.status(401).json({ erro: 'Código inválido ou expirado' });
    }

    // Código válido — deleta do banco para não poder ser reutilizado
    await Codigo.deleteMany({ email });

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token });
  } catch (erro) {
    console.error('[VERIFICAR CÓDIGO]', erro.message);
    res.status(500).json({ erro: 'Erro ao verificar código' });
  }
};
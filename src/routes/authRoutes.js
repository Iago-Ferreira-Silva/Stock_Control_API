const express = require('express');
const router = express.Router();
const { login, verificarCodigo } = require('../controllers/authController');

// Envia email e senha, recebe confirmação de envio do código
router.post('/', login);

// Envia o código recebido por email, recebe o token JWT
router.post('/verificar', verificarCodigo);

module.exports = router;
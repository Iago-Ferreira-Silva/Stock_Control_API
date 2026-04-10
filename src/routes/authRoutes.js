const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// POST /logar — rota pública, não precisa de authMiddleware
router.post('/', login);

module.exports = router;
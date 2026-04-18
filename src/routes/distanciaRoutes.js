const express = require('express');
const router = express.Router();

const { calcularDistancia } = require('../controllers/distanciaController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/distancia', authMiddleware, calcularDistancia);

module.exports = router;
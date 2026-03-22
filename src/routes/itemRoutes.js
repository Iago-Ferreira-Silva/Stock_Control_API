const express = require('express');
const router = express.Router();

const controller = require('../controllers/itemController');
const authMiddleware = require('../middlewares/authMiddleware');
const { gerarPDF } = require('../services/pdfService');

// Rotas protegidas
router.get('/itens', authMiddleware, controller.listar);
router.post('/itens', authMiddleware, controller.criar);
router.get('/itens/:id', authMiddleware, controller.buscar);
router.delete('/itens/:id', authMiddleware, controller.deletar);

// PDF
router.get('/relatorio/pdf', authMiddleware, gerarPDF);

module.exports = router;
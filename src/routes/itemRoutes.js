const express = require('express');
const router = express.Router();

const controller = require('../controllers/itemController');
const authMiddleware = require('../middlewares/authMiddleware');
const { gerarPDF } = require('../services/pdfService');

router.get('/itens', authMiddleware, controller.listar);
router.post('/itens', authMiddleware, controller.criar);
router.get('/itens/:id', authMiddleware, controller.buscar);
router.put('/itens/:id', authMiddleware, controller.atualizar);
router.delete('/itens/:id', authMiddleware, controller.deletar);

router.get('/relatorio/pdf', authMiddleware, gerarPDF);

module.exports = router;
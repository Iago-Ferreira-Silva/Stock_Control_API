const express = require('express');
const router = express.Router();

const controller = require('../controllers/itemController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../config/upload');
const { gerarPDF } = require('../services/pdfService');

router.get('/itens', authMiddleware, controller.listar);
router.post('/itens', authMiddleware, controller.criar);
router.get('/itens/:id', authMiddleware, controller.buscar);
router.put('/itens/:id', authMiddleware, controller.atualizar);
router.delete('/itens/:id', authMiddleware, controller.deletar);

router.post('/itens/:id/imagem', authMiddleware, upload.single('imagem'), controller.uploadImagem);

router.get('/relatorio/pdf', authMiddleware, gerarPDF);

module.exports = router;
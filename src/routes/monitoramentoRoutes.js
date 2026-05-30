const express = require('express');
const router  = express.Router();

const { relatorioMonitoramento } = require('../controllers/monitoramentoController');
const authMiddleware             = require('../middlewares/authMiddleware');

// GET /relatorio/monitoramento
router.get('/relatorio/monitoramento', authMiddleware, relatorioMonitoramento);

module.exports = router;
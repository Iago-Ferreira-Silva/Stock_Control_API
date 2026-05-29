const express = require('express');
const router  = express.Router();

const { exportarCSV } = require('../controllers/exportController');
const authMiddleware  = require('../middlewares/authMiddleware');

// GET /exportar/csv — protegida, só usuários autenticados podem exportar
router.get('/exportar/csv', authMiddleware, exportarCSV);

module.exports = router;
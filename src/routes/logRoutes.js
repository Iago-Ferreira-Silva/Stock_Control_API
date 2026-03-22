const express = require('express');
const router = express.Router();

const { buscarPorData } = require('../controllers/logController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/logs', authMiddleware, buscarPorData);

module.exports = router;
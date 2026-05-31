const express = require('express');
const router  = express.Router();

const { streamVideo, listarVideos } = require('../controllers/videoController');
const authMiddleware = require('../middlewares/authMiddleware');

// Lista os vídeos disponíveis
router.get('/video', authMiddleware, listarVideos);

// Faz o stream de um vídeo específico
// Exemplo: GET /video/stream/demo.mp4
router.get('/video/stream/:arquivo', authMiddleware, streamVideo);

module.exports = router;
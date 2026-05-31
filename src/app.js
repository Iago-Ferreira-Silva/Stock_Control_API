require('dotenv').config();

const path    = require('path');
const express = require('express');
const cors    = require('cors');

const authRoutes          = require('./routes/authRoutes');
const itemRoutes          = require('./routes/itemRoutes');
const logRoutes           = require('./routes/logRoutes');
const distanciaRoutes     = require('./routes/distanciaRoutes');
const exportRoutes        = require('./routes/exportRoutes');
const monitoramentoRoutes = require('./routes/monitoramentoRoutes');
const videoRoutes         = require('./routes/videoRoutes');

const loggerMiddleware  = require('./middlewares/loggerMiddleware');
const weekdayMiddleware = require('./middlewares/weekdayMiddleware');

const app = express();

// CORS
const origensPermitidas = [
  'http://localhost:3000',
  'https://stock-control-api-f7em.onrender.com',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (origensPermitidas.includes(origin)) return callback(null, true);
    callback(new Error('Origem não permitida pelo CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middlewares globais
app.use(express.json());
app.use(loggerMiddleware);

// Rotas
app.get('/', (req, res) => {
  res.json({ mensagem: 'Stock Control API 🚀', status: 'online' });
});

// Páginas de teste
app.get('/socket-test', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'socket-test.html'));
});

app.get('/video-test', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'video-test.html'));
});

app.use('/logar', authRoutes);
//app.use(weekdayMiddleware);
app.use(itemRoutes);
app.use(logRoutes);
app.use(distanciaRoutes);
app.use(exportRoutes);
app.use(monitoramentoRoutes);
app.use(videoRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Erro global
app.use((err, req, res, next) => {
  console.error('[ERRO INTERNO]', err.message);
  res.status(500).json({ erro: 'Erro interno no servidor' });
});

module.exports = app;
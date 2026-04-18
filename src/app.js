require('dotenv').config();

const express = require('express');
const cors = require('cors');
const conectar = require('./database/conexao');

const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const logRoutes = require('./routes/logRoutes');
const distanciaRoutes = require('./routes/distanciaRoutes');

const loggerMiddleware = require('./middlewares/loggerMiddleware');
const weekdayMiddleware = require('./middlewares/weekdayMiddleware');

conectar();

const app = express();

// CORS
// Lista de origens que podem fazer requisições para esta API.
const origensPermitidas = [
  'http://localhost:3000',
  'https://stock-control-api-f7em.onrender.com',
];

app.use(cors({
  origin: (origin, callback) => {
    // Permite requisições sem origin (Postman, curl, apps mobile)
    if (!origin) return callback(null, true);

    if (origensPermitidas.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origem não permitida pelo CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middlewares globais
app.use(express.json());
app.use(loggerMiddleware);

// Rota raiz
app.get('/', (req, res) => {
  res.json({ mensagem: 'Stock Control API 🚀', status: 'online' });
});

// Rotas
app.use('/logar', authRoutes);
app.use(weekdayMiddleware);
app.use(itemRoutes);
app.use(logRoutes);
app.use(distanciaRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Erro global
app.use((err, req, res, next) => {
  console.error('[ERRO INTERNO]', err.message);
  res.status(500).json({ erro: 'Erro interno no servidor' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
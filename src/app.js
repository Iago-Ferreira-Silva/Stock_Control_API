require('dotenv').config(); // Carrega o .env ANTES de tudo — essa linha precisa ser a primeira

const express = require('express');
const cors = require('cors');
const conectar = require('./database/conexao');

const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const logRoutes = require('./routes/logRoutes');

const loggerMiddleware = require('./middlewares/loggerMiddleware');
const weekdayMiddleware = require('./middlewares/weekdayMiddleware');

// Conecta ao MongoDB assim que o servidor inicia
conectar();

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

app.get('/', (req, res) => {
  res.json({ mensagem: 'Stock Control API 🚀', status: 'online' });
});

app.use('/logar', authRoutes);
app.use(weekdayMiddleware);
app.use(itemRoutes);
app.use(logRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  console.error('[ERRO INTERNO]', err.message);
  res.status(500).json({ erro: 'Erro interno no servidor' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
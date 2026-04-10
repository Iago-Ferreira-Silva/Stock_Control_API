const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const logRoutes = require('./routes/logRoutes');

const loggerMiddleware = require('./middlewares/loggerMiddleware');
const weekdayMiddleware = require('./middlewares/weekdayMiddleware');

// Middlewares globais
app.use(cors());          // Permite que o front-end (em outro endereço) acesse a API
app.use(express.json());  // Transforma o corpo da requisição em objeto JavaScript
app.use(loggerMiddleware); // Registra todas as requisições no array de logs

// Rota raiz
app.get('/', (req, res) => {
  res.json({ mensagem: 'Stock Control API 🚀', status: 'online' });
});

// Rotas da aplicação
app.use('/logar', authRoutes);
app.use(weekdayMiddleware); // Bloqueia de sábado/domingo a partir daqui
app.use(itemRoutes);
app.use(logRoutes);

// Rota não encontrada (404)
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Tratamento global de erros (500)
app.use((err, req, res, next) => {
  console.error('[ERRO INTERNO]', err.message);
  res.status(500).json({ erro: 'Erro interno no servidor' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
const express = require('express');
const app = express();

const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const logRoutes = require('./routes/logRoutes');

const loggerMiddleware = require('./middlewares/loggerMiddleware');
const weekdayMiddleware = require('./middlewares/weekdayMiddleware');

app.use(express.json());

// Middlewares globais
app.use(loggerMiddleware);
app.use(weekdayMiddleware);

// Rotas
app.use(authRoutes);
app.use(itemRoutes);
app.use(logRoutes);

app.get('/', (req, res) => {
  res.send('Stock Control API 🚀');
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
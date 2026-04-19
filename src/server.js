const app      = require('./app');
const conectar = require('./database/conexao');

// Conecta ao banco primeiro, só depois sobe o servidor
conectar().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
});
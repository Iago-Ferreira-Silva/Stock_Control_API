const app = require('./app');
const conectar = require('./database/conexao');

conectar();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
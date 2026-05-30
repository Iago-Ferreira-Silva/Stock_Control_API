const http     = require('http');
const app      = require('./app');
const conectar = require('./database/conexao');
const cron     = require('node-cron');
const { executarBackup }  = require('./services/backupService');
const { iniciarSocket }   = require('./socket');

conectar().then(() => {
  // Cria o servidor HTTP a partir do Express
  // O Socket.io precisa do servidor HTTP, não do Express diretamente
  const httpServer = http.createServer(app);

  // Inicializa o Socket.io no servidor HTTP
  iniciarSocket(httpServer);

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });

  // Backup automático diário às 17h (Fortaleza = UTC-3 = 20h UTC)
  cron.schedule('0 20 * * *', () => {
    executarBackup();
  });

  console.log('Backup automatico agendado para as 17h (horario de Fortaleza)');
});
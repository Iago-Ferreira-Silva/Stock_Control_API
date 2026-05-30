const app      = require('./app');
const conectar = require('./database/conexao');
const cron     = require('node-cron');
const { executarBackup } = require('./services/backupService');

conectar().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

  cron.schedule('0 20 * * *', () => {
    executarBackup();
  });

  console.log('Backup automatico agendado para as 17h (horario de Fortaleza)');
});
const http = require("http");
const app = require("./app");
const conectar = require("./database/conexao");
const cron = require("node-cron");
const { executarBackup } = require("./services/backupService");
const { iniciarSocket } = require("./socket");
const { iniciarSensorWS } = require("./sensorWS");

conectar().then(() => {
  const httpServer = http.createServer(app);

  // Inicializa o Socket.io (para o navegador)
  iniciarSocket(httpServer);

  // Inicializa o WebSocket (para o ESP32/Wokwi)
  iniciarSensorWS(httpServer);

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });

  // Backup automático diário às 17h no horário de Fortaleza
  cron.schedule(
    "0 17 * * *",
    () => {
      executarBackup();
    },
    {
      timezone: "America/Fortaleza",
    },
  );

  console.log("Backup automático agendado para as 17h (America/Fortaleza)");
});

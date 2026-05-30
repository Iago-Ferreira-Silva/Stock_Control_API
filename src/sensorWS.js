const { WebSocketServer } = require('ws');
const { getIO } = require('./socket');

// Servidor WebSocket para receber dados do ESP32/Wokwi
// Funciona separado do Socket.io — um é para o ESP32, outro é para o navegador
const iniciarSensorWS = (httpServer) => {
  const wss = new WebSocketServer({
    server: httpServer,
    path: '/sensor',   // ESP32 conecta em ws://seu-servidor/sensor
  });

  wss.on('connection', (ws) => {
    console.log('[SENSOR] ESP32 conectado via WebSocket');

    ws.on('message', (mensagem) => {
      try {
        // ESP32 envia JSON: {"temperatura": 25.3, "umidade": 60.5}
        const dados = JSON.parse(mensagem.toString());

        console.log(`[SENSOR] Temperatura: ${dados.temperatura}°C | Umidade: ${dados.umidade}%`);

        // Repassa os dados para todos os navegadores via Socket.io
        getIO().emit('sensor:dados', {
          temperatura: dados.temperatura,
          umidade:     dados.umidade,
          timestamp:   new Date().toLocaleString('pt-BR', { timeZone: 'America/Fortaleza' }),
        });
      } catch (erro) {
        console.error('[SENSOR] Erro ao processar mensagem:', erro.message);
      }
    });

    ws.on('close', () => {
      console.log('[SENSOR] ESP32 desconectado');
    });

    ws.on('error', (erro) => {
      console.error('[SENSOR] Erro na conexão:', erro.message);
    });
  });

  console.log('[SENSOR] Servidor WebSocket aguardando ESP32 em /sensor');
};

module.exports = { iniciarSensorWS };
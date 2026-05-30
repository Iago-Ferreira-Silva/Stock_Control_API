const { Server } = require('socket.io');

let io;

// Inicializa o Socket.io
const iniciarSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`[SOCKET] Cliente conectado: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`[SOCKET] Cliente desconectado: ${socket.id}`);
    });
  });

  console.log('[SOCKET] Socket.io iniciado');
  return io;
};

// Retorna a instância do socket
// Usado pelos controllers para emitir eventos sem precisar importar o servidor
const getIO = () => {
  if (!io) throw new Error('Socket.io não foi inicializado');
  return io;
};

module.exports = { iniciarSocket, getIO };
const { Server } = require('socket.io');

let io;

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

const getIO = () => {
  return io || null;
};

module.exports = { iniciarSocket, getIO };
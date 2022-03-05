const { Server } = require('socket.io');
const logger = require('@greencoast/logger');

class WebSocketServer {
  constructor(httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET']
      }
    });

    this.initialize();
  }

  initialize() {
    this.io.on('connection', (socket) => {
      logger.log(`Received a connection: ${socket.id}`);

      socket.on('disconnect', () => {
        logger.log(`Closed connection: ${socket}`);
      });
    });
  }
}

module.exports = WebSocketServer;

const { Server } = require('socket.io');
const logger = require('@greencoast/logger');
const Connection = require('./Connection');

class WebSocketServer {
  constructor(httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET']
      }
    });
    this.connections = new Map();

    this.initialize();
  }

  initialize() {
    this.io.on('connection', (socket) => {
      logger.log(`Received a connection: ${socket.id}`);
      this.connections.set(socket.id, new Connection(this, socket));
    });
  }

  sendMeasure(measure) {
    this.io.sockets.emit('measure', measure);
  }
}

module.exports = WebSocketServer;

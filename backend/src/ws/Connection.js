const logger = require('@greencoast/logger');

class Connection {
  constructor(server, socket) {
    this.server = server;
    this.socket = socket;

    this._registerEvents();
  }

  _registerEvents() {
    this.socket.on('disconnect', () => this.disconnect());
  }

  disconnect() {
    logger.log(`Closed connection: ${this.socket.id}`);
    this.server.connections.delete(this.socket.id);
  }
}

module.exports = Connection;

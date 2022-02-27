const mongoose = require('mongoose');
const logger = require('@greencoast/logger');
const UsersDatabase = require('./UsersDatabase');

class MongoManager {
  constructor(uri) {
    this.mongo = this._createConnection(uri);
    this.registerConnectionEvents();

    this.users = new UsersDatabase(this.mongo);
  }

  _createConnection(uri) {
    return mongoose.createConnection(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  registerConnectionEvents() {
    this.mongo.on('connecting', () => {
      logger.info('(MONGO): Connecting to MongoDB...');
    });

    this.mongo.on('connected', () => {
      logger.info('(MONGO): Connected to MongoDB.');
    });

    this.mongo.on('disconnected', () => {
      logger.warn('(MONGO): Disconnected from MongoDB.');
    });

    this.mongo.on('reconnected', () => {
      logger.info('(MONGO): Reconnected to MongoDB.');
    });

    this.mongo.on('error', (error) => {
      logger.error('(MONGO): A connection error has occurred!', error);
    });

    return this;
  }
}

module.exports = MongoManager;

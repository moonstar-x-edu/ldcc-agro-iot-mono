const mongoose = require('mongoose');
const UsersDatabase = require('./UsersDatabase');

class MongoManager {
  constructor(uri) {
    this.mongo = this._createConnection(uri);

    this.users = new UsersDatabase(this.mongo);
  }

  _createConnection(uri) {
    return mongoose.createConnection(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
}

module.exports = MongoManager;

import normalize from 'normalize-mongoose';
const User = require('../classes/models/User');
const { InvalidBodyError, ResourceAlreadyExistsError } = require('../errors');
const { MONGO_CODES } = require('../constants');

class UsersDatabase {
  constructor(mongo) {
    this.mongo = mongo;

    User.MONGO_SCHEMA.plugin(normalize);
    this.UserModel = this.mongo.model('User', User.MONGO_SCHEMA);
  }

  async create(user) {
    if (!(user instanceof User)) {
      throw new InvalidBodyError('Given user is not instance of User.');
    }

    const model = this.UserModel(user.data);

    try {
      await model.save();
    } catch (error) {
      if (error.code === MONGO_CODES.DUPLICATE) {
        throw new ResourceAlreadyExistsError('Given user already exists on database.');
      }

      throw error;
    }
  }
}

module.exports = UsersDatabase;

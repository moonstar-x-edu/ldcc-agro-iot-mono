const logger = require('@greencoast/logger');
const User = require('../classes/models/User');
const { InvalidBodyError, ResourceAlreadyExistsError } = require('../errors');
const { MONGO_CODES, MONGO_TO_JSON_OPTIONS } = require('../constants');

class UsersDatabase {
  constructor(mongo) {
    this.mongo = mongo;

    User.MONGO_SCHEMA.options.toJSON = MONGO_TO_JSON_OPTIONS;
    this.UserModel = this.mongo.model('User', User.MONGO_SCHEMA);
  }

  async create(user) {
    if (!(user instanceof User)) {
      throw new InvalidBodyError('Given user is not instance of User.');
    }

    const model = this.UserModel(user.data);

    try {
      const doc = (await model.save()).toJSON()
      logger.info(`(MONGO): Created new user with ID ${doc.id}`);
      return doc;
    } catch (error) {
      if (error.code === MONGO_CODES.DUPLICATE) {
        throw new ResourceAlreadyExistsError('Given user already exists on database.');
      }

      throw error;
    }
  }
}

module.exports = UsersDatabase;

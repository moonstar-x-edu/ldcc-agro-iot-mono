const logger = require('@greencoast/logger');
const { CastError } = require('mongoose');
const User = require('../classes/models/User');
const { InvalidBodyError, ResourceAlreadyExistsError, ResourceNotFoundError } = require('../errors');
const { MONGO_CODES, MONGO_TO_JSON_OPTIONS } = require('../constants');

class UsersDatabase {
  constructor(mongo) {
    this.mongo = mongo;

    User.MONGO_SCHEMA.options.toJSON = MONGO_TO_JSON_OPTIONS;
    this.UserModel = this.mongo.model('User', User.MONGO_SCHEMA);
  }

  async get(id) {
    try {
      const doc = await this.UserModel.findById(id);

      if (!doc) {
        throw new ResourceNotFoundError(`User ${id} does not exist.`);
      }

      return doc;
    } catch (error) {
      if (error instanceof CastError) {
        throw new ResourceNotFoundError(`User ${id} does not exist.`);
      }

      throw error;
    }
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

  async delete(id) {
    try {
      const doc = await this.UserModel.findByIdAndDelete(id);

      if (!doc) {
        throw new ResourceNotFoundError(`User ${id} does not exist.`);
      }

      logger.info(`(MONGO): Deleted user with ID ${doc.id}`);
      return doc;
    } catch (error) {
      if (error instanceof CastError) {
        throw new ResourceNotFoundError(`User ${id} does not exist.`);
      }

      throw error;
    }
  }
}

module.exports = UsersDatabase;

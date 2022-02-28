const logger = require('@greencoast/logger');
const { CastError } = require('mongoose');
const User = require('../classes/models/User');
const { InvalidBodyError, ResourceAlreadyExistsError, ResourceNotFoundError, ResourceForbiddenError } = require('../errors');
const { MONGO_CODES, MONGO_TO_JSON_OPTIONS } = require('../constants');

class UsersDatabase {
  constructor(manager) {
    this.manager = manager;
    this.mongo = manager.mongo;

    User.MONGO_SCHEMA.options.toJSON = MONGO_TO_JSON_OPTIONS;
    this.UserModel = this.mongo.model('User', User.MONGO_SCHEMA);
  }

  getAll() {
    return this.UserModel.find({});
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

  async update(id, newUser) {
    if (!(newUser instanceof User)) {
      throw new InvalidBodyError('Given user is not instance of User.');
    }

    try {
      const doc = await this.UserModel.findByIdAndUpdate(id, newUser.data, { new: true });

      if (!doc) {
        throw new ResourceNotFoundError(`User ${id} does not exist.`);
      }

      logger.info(`(MONGO): Updated user with ID ${doc.id}`);
      return doc;
    } catch (error) {
      if (error instanceof CastError) {
        throw new ResourceNotFoundError(`User ${id} does not exist.`);
      }

      throw error;
    }
  }

  async getDevicesForUser(id) {
    const user = await this.get(id);

    return Promise.all(user.devices.map((deviceId) => {
      return this.manager.devices.get(deviceId);
    }));
  }

  async addDeviceForUser(userId, deviceId) {
    const user = await this.get(userId);
    const device = await this.manager.devices.get(deviceId);

    const userHasDevice = user.devices.some((id) => id === device.id);
    if (userHasDevice) {
      throw new ResourceAlreadyExistsError(`User ${userId} already has access to device ${deviceId}`);
    }

    const updated = await this.update(userId, new User({ devices: [...user.devices, deviceId] }));

    logger.info(`(MONGO): Added device ${deviceId} to the device list for user ${userId}`);
    return updated;
  }

  async deleteDeviceForUser(userId, deviceId) {
    const user = await this.get(userId);
    const device = await this.manager.devices.get(deviceId);

    const userHasDevice = user.devices.some((id) => id === device.id);
    if (!userHasDevice) {
      throw new ResourceForbiddenError(`User ${userId} does not have access to device ${deviceId}`);
    }

    const updated = await this.update(userId, new User({
      devices: user.devices.filter((id) => id !== deviceId)
    }));

    logger.info(`(MONGO): Removed device ${deviceId} from the device list for user ${userId}`);
    return updated;
  }

  getUsersWithAccessToDevice(deviceId) {
    return this.UserModel.find({ devices: deviceId });
  }
}

module.exports = UsersDatabase;

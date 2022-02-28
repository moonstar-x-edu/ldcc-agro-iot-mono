const logger = require('@greencoast/logger');
const { CastError } = require('mongoose');
const Device = require('../classes/models/Device');
const User = require('../classes/models/User');
const { InvalidBodyError, ResourceAlreadyExistsError, ResourceNotFoundError } = require('../errors');
const { MONGO_CODES, MONGO_TO_JSON_OPTIONS } = require('../constants');

class DeviceDatabase {
  constructor(manager) {
    this.manager = manager;
    this.mongo = manager.mongo;

    Device.MONGO_SCHEMA.options.toJSON = MONGO_TO_JSON_OPTIONS;
    this.DeviceModel = this.mongo.model('Device', Device.MONGO_SCHEMA);
  }

  getAll() {
    return this.DeviceModel.find({});
  }

  async get(id) {
    try {
      const doc = await this.DeviceModel.findById(id);

      if (!doc) {
        throw new ResourceNotFoundError(`Device ${id} does not exist.`);
      }

      return doc;
    } catch (error) {
      if (error instanceof CastError) {
        throw new ResourceNotFoundError(`Device ${id} does not exist.`);
      }

      throw error;
    }
  }

  async create(device) {
    if (!(device instanceof Device)) {
      throw new InvalidBodyError('Given device is not instance of Device.');
    }
    const owner = await this.manager.users.get(device.data.ownerId);
    const model = this.DeviceModel(device.data);

    try {
      const doc = (await model.save()).toJSON();
      logger.info(`(MONGO): Created new device with ID ${doc.id}`);

      await this.manager.users.update(owner.id, new User({ devices: [...owner.devices, doc.id] }));
      logger.info(`(MONGO): Added device ${doc.id} to the device list for user ${owner.id}`);

      return doc;
    } catch (error) {
      if (error.code === MONGO_CODES.DUPLICATE) {
        throw new ResourceAlreadyExistsError('Given device already exists on database.');
      }

      throw error;
    }
  }

  async delete(id) {
    try {
      const doc = await this.DeviceModel.findByIdAndDelete(id);

      if (!doc) {
        throw new ResourceNotFoundError(`Device ${id} does not exist.`);
      }

      const usersWithDevice = await this.manager.users.getUsersWithAccessToDevice(id);
      await Promise.all(usersWithDevice.map(async(user) => {
        await this.manager.users.update(user.id, new User({
          devices: user.devices.filter((deviceId) => deviceId !== id)
        }));
        logger.info(`(MONGO): Removed device ${id} from the device list for user ${user.id}`);
      }));

      // Delete measures

      logger.info(`(MONGO): Deleted device with ID ${doc.id}`);
      return doc;
    } catch (error) {
      if (error instanceof CastError) {
        throw new ResourceNotFoundError(`Device ${id} does not exist.`);
      }

      throw error;
    }
  }

  async update(id, newDevice) {
    if (!(newDevice instanceof Device)) {
      throw new InvalidBodyError('Given device is not instance of Device.');
    }

    try {
      const doc = await this.DeviceModel.findByIdAndUpdate(id, newDevice.data, { new: true });

      if (!doc) {
        throw new ResourceNotFoundError(`Device ${id} does not exist.`);
      }

      logger.info(`(MONGO): Updated device with ID ${doc.id}`);
      return doc;
    } catch (error) {
      if (error instanceof CastError) {
        throw new ResourceNotFoundError(`Device ${id} does not exist.`);
      }

      throw error;
    }
  }
}

module.exports = DeviceDatabase;

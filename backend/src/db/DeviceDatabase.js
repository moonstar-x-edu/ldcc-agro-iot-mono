const logger = require('@greencoast/logger');
const { CastError } = require('mongoose');
const Device = require('../classes/models/Device');
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
      logger.info(`(MONGO): Created new device with ID ${doc.id} for owner ${owner.id}`);
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

const logger = require('@greencoast/logger');
const { CastError } = require('mongoose');
const Measure = require('../classes/models/Measure');
const { InvalidBodyError, ResourceAlreadyExistsError, ResourceNotFoundError } = require('../errors');
const { MONGO_CODES, MONGO_TO_JSON_OPTIONS } = require('../constants');

class MeasureDatabase {
  constructor(manager) {
    this.manager = manager;
    this.mongo = manager.mongo;

    Measure.MONGO_SCHEMA.options.toJSON = MONGO_TO_JSON_OPTIONS;
    this.MeasureModel = this.mongo.model('Measure', Measure.MONGO_SCHEMA);
  }

  async getForDevice(deviceId) {
    try {
      return await this.MeasureModel.find({ deviceId });
    } catch (error) {
      if (error instanceof CastError) {
        throw new ResourceNotFoundError(`Device ${deviceId} does not exist.`);
      }

      throw error;
    }
  }

  async get(deviceId, measureId) {
    try {
      const doc = await this.MeasureModel.findById(measureId);

      if (!doc) {
        throw new ResourceNotFoundError(`Measure ${measureId} does not exist.`);
      }

      if (doc.deviceId.toString() !== deviceId) {
        throw new ResourceNotFoundError(`Measure ${measureId} does not exist for device ${deviceId}.`);
      }

      return doc;
    } catch (error) {
      if (error instanceof CastError) {
        throw new ResourceNotFoundError(`Measure ${measureId} does not exist.`);
      }

      throw error;
    }
  }

  async createForDevice(deviceId, measure) {
    if (!(measure instanceof Measure)) {
      throw new InvalidBodyError('Given measure is not instance of Measure.');
    }

    const device = await this.manager.devices.get(deviceId);
    const model = this.MeasureModel(measure.data);

    try {
      const doc = (await model.save()).toJSON();
      logger.info(`(MONGO): Created new measure with ID ${doc.id} for device ${device.id}`);

      return doc;
    } catch (error) {
      if (error.code === MONGO_CODES.DUPLICATE) {
        throw new ResourceAlreadyExistsError('Given measure already exists on database.');
      }

      throw error;
    }
  }

  async delete(deviceId, measureId) {
    try {
      await this.get(deviceId, measureId);
      const doc = await this.MeasureModel.findByIdAndDelete(measureId);

      if (!doc) {
        throw new ResourceNotFoundError(`Measure ${measureId} does not exist.`);
      }

      logger.info(`(MONGO): Deleted measure with ID ${measureId} for device ${deviceId}`);
      return doc;
    } catch (error) {
      if (error instanceof CastError) {
        throw new ResourceNotFoundError(`Measure ${measureId} does not exist.`);
      }

      throw error;
    }
  }

  async deleteForDevice(deviceId) {
    try {
      const docs = await this.MeasureModel.deleteMany({ deviceId });
      logger.info(`(MONGO): Removed all measures for device ${deviceId}`);
      return docs;
    } catch (error) {
      if (error instanceof CastError) {
        throw new ResourceNotFoundError(`Device ${deviceId} does not exist.`);
      }

      throw error;
    }
  }
}

module.exports = MeasureDatabase;

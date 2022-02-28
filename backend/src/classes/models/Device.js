const Joi = require('joi');
const { Schema: MongoSchema, ObjectId } = require('mongoose');
const SchemaValidator = require('../SchemaValidator');

class Device {
  constructor(data = {}) {
    this.data = data;
  }

  static from(obj, isNew = true) {
    return new Device(SchemaValidator.validate(obj, isNew ? Device.CREATE_SCHEMA : Device.UPDATE_SCHEMA));
  }
}

Device.CREATE_SCHEMA = Joi.object({
  id: Joi.forbidden(),
  name: Joi.string().trim().required(),
  description: Joi.string().trim().allow(null).allow('').default(null),
  iconURL: Joi.string().uri().allow(null).allow('').default(null),
  ownerId: Joi.string().required()
});

Device.UPDATE_SCHEMA = Joi.object({
  id: Joi.forbidden(),
  name: Joi.string().trim(),
  description: Joi.string().trim().allow(null).allow(''),
  iconURL: Joi.string().uri().allow(null).allow(''),
  ownerId: Joi.forbidden()
});

Device.MONGO_SCHEMA = new MongoSchema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  iconURL: {
    type: String,
    required: false
  },
  ownerId: {
    type: ObjectId,
    required: true
  }
});

module.exports = Device;

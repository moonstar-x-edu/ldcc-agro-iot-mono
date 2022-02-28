const Joi = require('joi');
const { Schema: MongoSchema, ObjectId } = require('mongoose');
const SchemaValidator = require('../SchemaValidator');

class Measure {
  constructor(data = {}) {
    this.data = data;
  }

  static from(obj) {
    const validated = SchemaValidator.validate(obj, Measure.CREATE_SCHEMA);
    validated.createdAt = (new Date()).toISOString();

    return new Measure(validated);
  }
}

Measure.CREATE_SCHEMA = Joi.object({
  id: Joi.forbidden(),
  deviceId: Joi.forbidden(),
  createdAt: Joi.forbidden(),
  temperature: Joi.number().min(-50).max(150).required(),
  humidity: Joi.number().min(0).max(1).required()
});

Measure.MONGO_SCHEMA = new MongoSchema({
  deviceId: {
    type: ObjectId,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  humidity: {
    type: Number,
    required: true
  }
});

module.exports = Measure;

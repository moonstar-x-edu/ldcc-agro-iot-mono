const Joi = require('joi');
const { Schema: MongoSchema } = require('mongoose');
const SchemaValidator = require('../SchemaValidator');

class User {
  constructor(data = {}) {
    this.data = data;
  }

  static from(obj, isNew = true) {
    return new User(SchemaValidator.validate(obj, isNew ? User.CREATE_SCHEMA : User.UPDATE_SCHEMA));
  }
}

User.CREATE_SCHEMA = Joi.object({
  id: Joi.forbidden(),
  name: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  profileURL: Joi.string().uri().allow(null).allow('').default(null),
  devices: Joi.forbidden().default([])
});

User.UPDATE_SCHEMA = Joi.object({
  id: Joi.forbidden(),
  name: Joi.string().trim(),
  lastName: Joi.string().trim(),
  email: Joi.forbidden(),
  profileURL: Joi.string().uri().allow(null).allow(''),
  devices: Joi.forbidden()
});

User.MONGO_SCHEMA = new MongoSchema({
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  profileURL: {
    type: String,
    required: false
  },
  devices: {
    type: [String],
    required: true
  }
});

module.exports = User;

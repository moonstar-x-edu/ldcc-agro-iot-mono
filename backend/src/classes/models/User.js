const Joi = require('joi');
const { v4: uuid } = require('uuid');
const SchemaValidator = require('../SchemaValidator');

class User {
  constructor(data = {}) {
    this.data = data;
  }

  static from(obj, isNew = true) {
    if (!isNew) {
      return new User(SchemaValidator.validate(obj, User.UPDATE_SCHEMA));
    }

    const data = SchemaValidator.validate(obj, User.CREATE_SCHEMA);

    data.id = uuid();

    return new User(data);
  }
}

User.CREATE_SCHEMA = Joi.object({
  id: Joi.forbidden(),
  name: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  profileURL: Joi.string().uri().allow(null).allow('').default(null),
  devices: Joi.forbidden().default([])
});

User.UPDATE_SCHEMA = Joi.object({
  id: Joi.forbidden(),
  name: Joi.string().trim(),
  lastName: Joi.string().trim(),
  profileURL: Joi.string().uri().allow(null).allow(''),
  devices: Joi.forbidden()
});

module.exports = User;

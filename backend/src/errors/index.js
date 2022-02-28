const ResourceNotFoundError = require('./ResourceNotFoundError');
const InvalidBodyError = require('./InvalidBodyError');
const ResourceAlreadyExistsError = require('./ResourceAlreadyExistsError');
const ResourceForbiddenError = require('./ResourceForbiddenError');

module.exports = {
  ResourceNotFoundError,
  InvalidBodyError,
  ResourceAlreadyExistsError,
  ResourceForbiddenError
};

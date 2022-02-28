const ResourceNotFoundError = require('./ResourceNotFoundError');
const InvalidBodyError = require('./InvalidBodyError');
const ResourceAlreadyExistsError = require('./ResourceAlreadyExistsError');
const ResourceForbiddenError = require('./ResourceForbiddenError');
const UnauthorizedRequestError = require('./UnauthorizedRequestError');

module.exports = {
  ResourceNotFoundError,
  InvalidBodyError,
  ResourceAlreadyExistsError,
  ResourceForbiddenError,
  UnauthorizedRequestError
};

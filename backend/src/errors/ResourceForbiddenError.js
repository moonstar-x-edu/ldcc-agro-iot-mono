const Response = require('../classes/Response');

class ResourceForbiddenError extends Error {
  constructor(message) {
    super(message);

    this.name = 'ResourceForbiddenError';
    this.statusCode = Response.CODES.FORBIDDEN;
  }
}

module.exports = ResourceForbiddenError;

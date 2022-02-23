const Response = require('../classes/Response');

class ResourceNotFoundError extends Error {
  constructor(message) {
    super(message);

    this.name = 'ResourceNotFoundError';
    this.statusCode = Response.CODES.NOT_FOUND;
  }
}

module.exports = ResourceNotFoundError;

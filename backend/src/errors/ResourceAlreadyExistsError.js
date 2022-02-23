const Response = require('../classes/Response');

class ResourceAlreadyExistsError extends Error {
  constructor(message) {
    super(message);

    this.name = 'ResourceAlreadyExistsError';
    this.statusCode = Response.CODES.BAD_REQUEST;
  }
}

module.exports = ResourceAlreadyExistsError;

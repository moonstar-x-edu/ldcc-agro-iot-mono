const Response = require('../classes/Response');

class InvalidBodyError extends Error {
  constructor(message) {
    super(message);

    this.name = 'InvalidBodyError';
    this.statusCode = Response.CODES.BAD_REQUEST;
  }
}

module.exports = InvalidBodyError;

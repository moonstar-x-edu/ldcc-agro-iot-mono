const Response = require('../classes/Response');

class UnauthorizedRequestError extends Error {
  constructor(message) {
    super(message);

    this.name = 'UnauthorizedRequestError';
    this.statusCode = Response.CODES.UNAUTHORIZED;
  }
}

module.exports = UnauthorizedRequestError;

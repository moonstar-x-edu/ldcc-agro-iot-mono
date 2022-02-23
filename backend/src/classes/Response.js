class Response {
  constructor(code) {
    this.code = code;

    this.response = {
      success: true,
      status: code
    };
  }

  create(content) {
    switch (this.code) {
      case Response.CODES.OK:
      case Response.CODES.CREATED:
        this._successfulOperation(content);
        break;

      case Response.CODES.BAD_REQUEST:
      case Response.CODES.NOT_FOUND:
      case Response.CODES.INTERNAL_SERVER_ERROR:
        this._failedOperation(Response.DEFAULT_MESSAGES[this.code], content);
        break;

      case Response.CODES.METHOD_NOT_ALLOWED:
        this._failedOperation(Response.DEFAULT_MESSAGES[this.code]);
        break;

      default:
        throw new Error(`Status code ${this.code} not supported!`);
    }

    return this.response;
  }

  _successfulOperation(data) {
    this.response.data = data;
  }

  _failedOperation(message, error = null) {
    this.response.success = false;
    this.response.message = message;

    if (error) {
      this.response.error = error instanceof Error ? error.message : error;
    }
  }
}

Response.CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500
};

Response.DEFAULT_MESSAGES = {
  [Response.CODES.BAD_REQUEST]: "The server couldn't process your request.",
  [Response.CODES.NOT_FOUND]: 'The requested resource was not found. Please check that the endpoint is written correctly.',
  [Response.CODES.METHOD_NOT_ALLOWED]: 'This method is not allowed on this endpoint.',
  [Response.CODES.INTERNAL_SERVER_ERROR]: 'Something went wrong when accessing the requested resource.',
  MISSING_JSON_BODY: 'A non-empty JSON body is required!'
};

module.exports = Response;

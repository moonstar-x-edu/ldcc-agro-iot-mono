/* eslint-disable max-params */
const logger = require('@greencoast/logger');
const onFinished = require('on-finished');
const Response = require('../classes/Response');

const onlySupportedMethods = (methods) => {
  return (_, res) => {
    res.header('Access-Control-Allow-Methods', `${methods.join(' ')} OPTIONS`);

    const response = new Response(Response.CODES.METHOD_NOT_ALLOWED);
    return res.status(response.code).send(response.create());
  };
};

const handleError = (error, req, res, next) => {
  const code = error.statusCode || Response.CODES.INTERNAL_SERVER_ERROR;

  if (code === Response.CODES.INTERNAL_SERVER_ERROR) {
    logger.error(error);
  }

  const response = new Response(code);
  res.status(response.code).send(response.create(error));

  next();
};

const logRequests = (req, res, next) => {
  onFinished(res, (error, res) => {
    if (error) {
      logger.error(error);
      return;
    }

    logger.info(`${req.method}:${req.path} ${res.statusCode} (${req.ip})`);
  });

  next();
};

module.exports = {
  onlySupportedMethods,
  handleError,
  logRequests
};

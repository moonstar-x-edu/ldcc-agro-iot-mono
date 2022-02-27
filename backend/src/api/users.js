const express = require('express');
const bodyParser = require('body-parser');
const Response = require('../classes/Response');
const User = require('../classes/models/User');
const { onlySupportedMethods } = require('../middleware');
const { InvalidBodyError } = require('../errors');

const router = new express.Router();
router.use(bodyParser.json());

/* TODO: GET / */
/* TODO: POST / */

router.post('/', (req, res) => {
  const { body } = req;

  if (!body || Object.keys(body).length < 1 ) {
    throw new InvalidBodyError(Response.DEFAULT_MESSAGES.MISSING_JSON_BODY);
  }

  const user = User.from(body).data;
  const response = new Response(Response.CODES.CREATED);
  return res.status(response.code).send(response.create(user));
});

router.all('/', onlySupportedMethods(['GET', 'POST']));

/* TODO: GET /:id */
/* TODO: DELETE /:id */
/* TODO: PATCH /:id */

router.all('/:id', onlySupportedMethods(['GET', 'DELETE', 'PATCH']));

/* TODO: GET /:userId/devices */
/* TODO: POST /:userId/devices */

router.all('/:userId/devices', onlySupportedMethods(['GET', 'POST']));

/* TODO: GET /:userId/devices/:deviceId */
/* TODO: DELETE /:userId/devices/:deviceId */

router.all('/:userId/devices/:deviceId', onlySupportedMethods(['GET', 'DELETE']));

module.exports = router;

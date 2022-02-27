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

router.post('/', async(req, res, next) => {
  const { body } = req;
  const { users: db } = req.app.get('mongo');

  if (!body || Object.keys(body).length < 1 ) {
    throw new InvalidBodyError(Response.DEFAULT_MESSAGES.MISSING_JSON_BODY);
  }

  try {
    const user = User.from(body).data;
    await db.create(user);

    const response = new Response(Response.CODES.CREATED);
    return res.status(response.code).send(response.create(user.data));
  } catch (error) {
    next(error);
  }
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

const express = require('express');
const bodyParser = require('body-parser');
const Response = require('../classes/Response');
const User = require('../classes/models/User');
const { onlySupportedMethods } = require('../middleware');
const { InvalidBodyError } = require('../errors');

const router = new express.Router();
router.use(bodyParser.json());

/* TODO: GET / */

router.post('/', async(req, res, next) => {
  const { body } = req;
  const { users: db } = req.app.get('mongo');

  if (!body || Object.keys(body).length < 1 ) {
    throw new InvalidBodyError(Response.DEFAULT_MESSAGES.MISSING_JSON_BODY);
  }

  try {
    const user = User.from(body);
    const doc = await db.create(user);

    const response = new Response(Response.CODES.CREATED);
    return res.status(response.code).send(response.create(doc));
  } catch (error) {
    next(error);
  }
});

router.all('/', onlySupportedMethods(['GET', 'POST']));

router.get('/:id', async(req, res, next) => {
  const { id } = req.params;
  const { users: db } = req.app.get('mongo');

  try {
    const doc = await db.get(id);

    const response = new Response(Response.CODES.OK);
    return res.status(response.code).send(response.create(doc));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async(req, res, next) => {
  const { id } = req.params;
  const { users: db } = req.app.get('mongo');

  try {
    const doc = await db.delete(id);

    const response = new Response(Response.CODES.OK);
    return res.status(response.code).send(response.create(doc));
  } catch (error) {
    next(error);
  }
});

/* TODO: PATCH /:id */

router.all('/:id', onlySupportedMethods(['GET', 'DELETE', 'PATCH']));

/* TODO: GET /:userId/devices */
/* TODO: POST /:userId/devices */

router.all('/:userId/devices', onlySupportedMethods(['GET', 'POST']));

/* TODO: GET /:userId/devices/:deviceId */
/* TODO: DELETE /:userId/devices/:deviceId */

router.all('/:userId/devices/:deviceId', onlySupportedMethods(['GET', 'DELETE']));

module.exports = router;

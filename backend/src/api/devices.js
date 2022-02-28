const express = require('express');
const bodyParser = require('body-parser');
const Response = require('../classes/Response');
const Device = require('../classes/models/Device');
const { onlySupportedMethods } = require('../middleware');
const { InvalidBodyError } = require('../errors');
const measuresRouter = require('./measures');

const router = new express.Router();
router.use(bodyParser.json());

router.use('/:deviceId/measures', measuresRouter);

router.get('/', async(req, res) => {
  const { devices: db } = req.app.get('mongo');

  const docs = await db.getAll();

  const response = new Response(Response.CODES.OK);
  return res.status(response.code).send(response.create(docs));
});

router.post('/', async(req, res, next) => {
  const { body } = req;
  const { devices: db } = req.app.get('mongo');

  try {
    if (!body || Object.keys(body).length < 1) {
      throw new InvalidBodyError(Response.DEFAULT_MESSAGES.MISSING_JSON_BODY);
    }

    const device = Device.from(body);
    const doc = await db.create(device);

    const response = new Response(Response.CODES.CREATED);
    return res.status(response.code).send(response.create(doc));
  } catch (error) {
    next(error);
  }
});

router.all('/', onlySupportedMethods(['GET', 'POST']));

router.get('/:id', async(req, res, next) => {
  const { id } = req.params;
  const { devices: db } = req.app.get('mongo');

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
  const { devices: db } = req.app.get('mongo');

  try {
    const doc = await db.delete(id);

    const response = new Response(Response.CODES.OK);
    return res.status(response.code).send(response.create(doc));
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async(req, res, next) => {
  const { body, params: { id } } = req;
  const { devices: db } = req.app.get('mongo');

  try {
    if (!body || Object.keys(body).length < 1) {
      throw new InvalidBodyError(Response.DEFAULT_MESSAGES.MISSING_JSON_BODY);
    }

    const device = Device.from(body, false);
    const doc = await db.update(id, device);

    const response = new Response(Response.CODES.OK);
    return res.status(response.code).send(response.create(doc));
  } catch (error) {
    next(error);
  }
});

router.all('/:id', onlySupportedMethods(['GET', 'DELETE', 'PATCH']));

module.exports = router;

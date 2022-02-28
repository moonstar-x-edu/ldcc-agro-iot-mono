const express = require('express');
const bodyParser = require('body-parser');
const Response = require('../classes/Response');
const Measure = require('../classes/models/Measure');
const { onlySupportedMethods } = require('../middleware');
const { InvalidBodyError } = require('../errors');

const router = new express.Router({ mergeParams: true });
router.use(bodyParser.json());

router.get('/', async(req, res, next) => {
  try {
    const { deviceId } = req.params;
    const { measures: db } = req.app.get('mongo');

    const docs = await db.getForDevice(deviceId);

    const response = new Response(Response.CODES.OK);
    return res.status(response.code).send(response.create(docs));
  } catch (error) {
    next(error);
  }
});

router.post('/', async(req, res, next) => {
  const { body, params: { deviceId } } = req;
  const { measures: db } = req.app.get('mongo');

  try {
    if (!body || Object.keys(body).length < 1) {
      throw new InvalidBodyError(Response.DEFAULT_MESSAGES.MISSING_JSON_BODY);
    }

    const measure = Measure.from(body, deviceId);
    const doc = await db.createForDevice(deviceId, measure);

    const response = new Response(Response.CODES.CREATED);
    return res.status(response.code).send(response.create(doc));
  } catch (error) {
    next(error);
  }
});

router.delete('/', async(req, res, next) => {
  try {
    const { deviceId } = req.params;
    const { measures: db } = req.app.get('mongo');

    const docs = await db.deleteForDevice(deviceId);

    const response = new Response(Response.CODES.OK);
    return res.status(response.code).send(response.create(docs));
  } catch (error) {
    next(error);
  }
});

router.all('/', onlySupportedMethods(['GET', 'POST', 'DELETE']));

router.get('/:measureId', async(req, res, next) => {
  try {
    const { deviceId, measureId } = req.params;
    const { measures: db } = req.app.get('mongo');

    const doc = await db.get(deviceId, measureId);

    const response = new Response(Response.CODES.OK);
    return res.status(response.code).send(response.create(doc));
  } catch (error) {
    next(error);
  }
});

router.delete('/:measureId', async(req, res, next) => {
  try {
    const { deviceId, measureId } = req.params;
    const { measures: db } = req.app.get('mongo');

    const doc = await db.delete(deviceId, measureId);

    const response = new Response(Response.CODES.OK);
    return res.status(response.code).send(response.create(doc));
  } catch (error) {
    next(error);
  }
});

router.all('/:measureId', onlySupportedMethods(['GET', 'DELETE']));

module.exports = router;

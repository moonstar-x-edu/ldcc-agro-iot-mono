const express = require('express');
const bodyParser = require('body-parser');
const Response = require('../classes/Response');
const User = require('../classes/models/User');
const { onlySupportedMethods } = require('../middleware');
const { InvalidBodyError, ResourceForbiddenError } = require('../errors');

const router = new express.Router();
router.use(bodyParser.json());

router.get('/', async(req, res) => {
  const { users: db } = req.app.get('mongo');

  const docs = await db.getAll();

  const response = new Response(Response.CODES.OK);
  return res.status(response.code).send(response.create(docs));
});

router.post('/', async(req, res, next) => {
  const { body } = req;
  const { users: db } = req.app.get('mongo');

  try {
    if (!body || Object.keys(body).length < 1) {
      throw new InvalidBodyError(Response.DEFAULT_MESSAGES.MISSING_JSON_BODY);
    }

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

router.patch('/:id', async(req, res, next) => {
  const { body, params: { id } } = req;
  const { users: db } = req.app.get('mongo');

  try {
    if (!body || Object.keys(body).length < 1) {
      throw new InvalidBodyError(Response.DEFAULT_MESSAGES.MISSING_JSON_BODY);
    }

    const user = User.from(body, false);
    const doc = await db.update(id, user);

    const response = new Response(Response.CODES.OK);
    return res.status(response.code).send(response.create(doc));
  } catch (error) {
    next(error);
  }
});

router.all('/:id', onlySupportedMethods(['GET', 'DELETE', 'PATCH']));

router.get('/:userId/devices', async(req, res, next) => {
  const { userId } = req.params;
  const { users: db } = req.app.get('mongo');

  try {
    const docs = await db.getDevicesForUser(userId);

    const response = new Response(Response.CODES.OK);
    return res.status(response.code).send(response.create(docs));
  } catch (error) {
    next(error);
  }
});

router.all('/:userId/devices', onlySupportedMethods(['GET']));

router.get('/:userId/devices/:deviceId', async(req, res, next) => {
  const { userId, deviceId } = req.params;
  const { users: usersDB, devices: devicesDB } = req.app.get('mongo');

  try {
    const user = await usersDB.get(userId);
    const device = await devicesDB.get(deviceId);

    const userHasDevice = user.devices.some((id) => id === deviceId);

    if (!userHasDevice) {
      throw new ResourceForbiddenError(`User ${userId} does not have access to device ${deviceId}`);
    }

    const response = new Response(Response.CODES.OK);
    return res.status(response.code).send(response.create(device));
  } catch (error) {
    next(error);
  }
});

router.post('/:userId/devices/:deviceId', async(req, res, next) => {
  const { userId, deviceId } = req.params;
  const { users: usersDB } = req.app.get('mongo');

  try {
    const updatedUser = await usersDB.addDeviceForUser(userId, deviceId);

    const response = new Response(Response.CODES.OK);
    return res.status(response.code).send(response.create(updatedUser));
  } catch (error) {
    next(error);
  }
});

router.delete('/:userId/devices/:deviceId', async(req, res, next) => {
  const { userId, deviceId } = req.params;
  const { users: usersDB } = req.app.get('mongo');

  try {
    const updatedUser = await usersDB.deleteDeviceForUser(userId, deviceId);

    const response = new Response(Response.CODES.OK);
    return res.status(response.code).send(response.create(updatedUser));
  } catch (error) {
    next(error);
  }
});

router.all('/:userId/devices/:deviceId', onlySupportedMethods(['GET', 'POST', 'DELETE']));

module.exports = router;

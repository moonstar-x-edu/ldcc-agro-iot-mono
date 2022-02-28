const express = require('express');
const { ResourceNotFoundError } = require('../errors');
const { basicAuth } = require('../middleware');
const usersRouter = require('./users');
const devicesRouter = require('./devices');

const router = express.Router();
router.use(basicAuth);

router.use('/users', usersRouter);
router.use('/devices', devicesRouter);

router.all('*', (req, res) => {
  throw new ResourceNotFoundError('This route is not handled by the server.');
});

module.exports = router;

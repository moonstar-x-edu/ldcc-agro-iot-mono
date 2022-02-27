const express = require('express');
const { ResourceNotFoundError } = require('../errors');
const usersRouter = require('./users');

const router = express.Router();

router.use('/users', usersRouter);

router.all('*', (req, res) => {
  throw new ResourceNotFoundError('This route is not handled by the server.');
});

module.exports = router;

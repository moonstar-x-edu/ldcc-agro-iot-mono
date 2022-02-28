const express = require('express');
const bodyParser = require('body-parser');
const Response = require('../classes/Response');
const Measure = require('../classes/models/Measure');
const { onlySupportedMethods } = require('../middleware');
const { InvalidBodyError } = require('../errors');

const router = new express.Router({ mergeParams: true });
router.use(bodyParser.json());

/* TODO: GET / */
/* TODO: POST / */

router.all('/', onlySupportedMethods(['GET', 'POST']));

/* TODO: GET /:id */
/* TODO: DELETE /:id */

router.all('/:measureId', onlySupportedMethods(['GET', 'DELETE']));

module.exports = router;

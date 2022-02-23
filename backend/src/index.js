require('dotenv').config();
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const logger = require('@greencoast/logger');
const { logRequests, handleError } = require('./middleware');
const { ResourceNotFoundError } = require('./errors');

const HTTP_PORT = process.env.PORT || 4000;
const { WEBAPP_DIR } = process.env;

if (!fs.existsSync(WEBAPP_DIR)) {
  throw new ReferenceError(`${WEBAPP_DIR} does not exist!`);
}

const app = express();
app.use(cors());
app.use(logRequests);

app.options('*', cors());

app.use(express.static(WEBAPP_DIR));

app.all('*', (req, res) => {
  throw new ResourceNotFoundError('This route is not handled by the server.');
});

app.use(handleError);

app.listen(HTTP_PORT, () => {
  logger.info(`API listening on port: ${HTTP_PORT}`);
});

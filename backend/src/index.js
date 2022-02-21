require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('@greencoast/logger');

const HTTP_PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());

app.options('*', cors());

app.get('/', (req, res) => {
  res.status(200).send('It works!');
});

app.all('*', (req, res) => {
  res.status(404).send('Not found!');
});

app.listen(HTTP_PORT, () => {
  logger.info(`API listening on port: ${HTTP_PORT}`);
});

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createServer } = require('http');
const express = require('express');
const cors = require('cors');
const logger = require('@greencoast/logger');
const apiRouter = require('./api');
const MongoManager = require('./db/MongoManager');
const WebSocketServer = require('./ws/WebSocketServer');
const { logRequests, handleError } = require('./middleware');
const { ResourceNotFoundError } = require('./errors');

const HTTP_PORT = process.env.PORT || 4000;
const { WEBAPP_DIR } = process.env;

if (!fs.existsSync(WEBAPP_DIR)) {
  throw new ReferenceError(`${WEBAPP_DIR} does not exist!`);
}

const WEBAPP_INDEX = path.join(WEBAPP_DIR, './index.html');

const app = express();
const httpServer = createServer(app);
app.use(cors());
app.use(logRequests);

app.set('mongo', new MongoManager(process.env.MONGODB_URI));
app.set('ws', new WebSocketServer(httpServer));

app.options('*', cors());

app.use(express.static(WEBAPP_DIR));

app.use('/api', apiRouter);

app.get('*', (req, res) => {
  res.sendFile(WEBAPP_INDEX);
});

app.all('*', () => {
  throw new ResourceNotFoundError('This route is not handled by the server.');
});

app.use(handleError);

httpServer.listen(HTTP_PORT, () => {
  logger.info(`API listening on port: ${HTTP_PORT}`);
});

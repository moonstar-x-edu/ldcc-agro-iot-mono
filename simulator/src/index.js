require('dotenv').config();
const logger = require('@greencoast/logger');
const Client = require('./client');
const { wait } = require('./utils');

const client = new Client(process.env.API_URL, process.env.API_TOKEN, {
  deviceId: process.env.DEVICE_ID
});

const setup = async() => {
  const device = await client.getDevice();

  logger.info(`Will post fake measures to device ${device.name}.`);
};

const loop = async() => {


  await wait(5);
};

const main = async() => {
  await setup();

  while (true) {
    await loop();
  }
};

main();


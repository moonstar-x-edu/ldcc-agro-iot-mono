require('dotenv').config();
const logger = require('@greencoast/logger');
const faker = require('@faker-js/faker').default;
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
  const temperature = faker.datatype.number({ min: 18, max: 30, precision: 0.01 });
  const humidity = faker.datatype.number({ min: 0.6, max: 0.8, precision: 0.01 });

  const measure = await client.postMeasure({ temperature, humidity });
  logger.info(`Posted measure with temperature ${measure.temperature} and humidity ${measure.humidity}`);

  await wait(5);
};

const main = async() => {
  await setup();

  while (true) {
    await loop();
  }
};

main();


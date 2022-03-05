const axios = require('axios');

class Client {
  constructor(apiURL, token, { deviceId }) {
    this.http = axios.create({
      baseURL: apiURL,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    this.deviceId = deviceId;
  }

  getDevice() {
    return this.http.get(`devices/${this.deviceId}`)
      .then((response) => response.data.data);
  }

  postMeasure({ temperature, humidity }) {
    return this.http.post(`devices/${this.deviceId}/measures`, { temperature, humidity })
      .then((response) => response.data.data);
  }
}

module.exports = Client;

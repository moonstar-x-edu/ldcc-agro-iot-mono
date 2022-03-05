import axios from 'axios';

const TOKEN = process.env.REACT_APP_API_TOKEN;
const API_URL = process.env.NODE_ENV === 'development' ?
  'http://localhost:4000/api/' :
  `${window.location.origin}/api/`;

const client = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`
  }
});

export const getUser = async(id) => {
  try {
    return (await client.get(`users/${id}`)).data.data;
  } catch (error) {
    throw error.response?.data.error || error.response?.data.message || error.message;
  }
};

export const getDevicesForUser = async(userId) => {
  try {
    return (await client.get(`users/${userId}/devices`)).data.data;
  } catch (error) {
    throw error.response?.data.error || error.response?.data.message || error.message;
  }
};

export const getMeasuresForDevice = async(deviceId) => {
  try {
    return (await client.get(`devices/${deviceId}/measures`)).data.data;
  } catch (error) {
    throw error.response?.data.error || error.response?.data.message || error.message;
  }
};

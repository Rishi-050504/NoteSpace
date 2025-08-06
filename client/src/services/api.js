// client/src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: '/api', // Your backend URL
});

// Interceptor to add the auth token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
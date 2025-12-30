import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const login = (email, password) => {
  return apiClient.post('/api/login', { email, password });
};

export const getIPInfo = (ip = null) => {
  if (ip) {
    return apiClient.get('/api/ip-info', { params: { ip } });
  }
  return apiClient.get('/api/ip-info');
};

export default apiClient;

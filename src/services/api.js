import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ip-geo-api-production-0c91.up.railway.app/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const login = (email, password) => {
  return apiClient.post('/auth/login', { email, password });
};

export const getIPInfo = (ip = null) => {
  if (ip) {
    return apiClient.get('/auth/ip-info', { params: { ip } });
  }
  return apiClient.get('/auth/ip-info');
};

export default apiClient;

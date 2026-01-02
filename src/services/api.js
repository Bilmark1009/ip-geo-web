import axios from 'axios';

// This is correct - your base URL includes /api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ip-geo-api-production-0c91.up.railway.app/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Remove '/auth' from the path since it's already in the base URL
export const login = (email, password) => {
  return apiClient.post('/login', { email, password });
};

export const getIPInfo = (ip = null) => {
  if (ip) {
    return apiClient.get('/ip-info', { params: { ip } });
  }
  return apiClient.get('/ip-info');
};

export default apiClient;

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = (email, password) => {
  return apiClient.post('/login', { email, password });
};

export const register = (userData) => {
  return apiClient.post('/register', userData);
};

// IP Info endpoint
export const getIPInfo = (ip = null) => {
  if (ip) {
    return apiClient.get('/ip-info', { params: { ip } });
  }
  return apiClient.get('/ip-info');
};

// Token validation
export const validateToken = () => {
  return apiClient.get('/validate-token');
};

export default apiClient;

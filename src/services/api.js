  import axios from 'axios';

  // Base URL for the API
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ip-geo-api-production-0c91.up.railway.app/api';

  // Create axios instance with default config
  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    withCredentials: true
  });

  // Add request interceptor to add timestamp to prevent caching
  apiClient.interceptors.request.use(config => {
    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });

  // Add response interceptor for better error handling
  apiClient.interceptors.response.use(
    response => response,
    error => {
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('API Error:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request setup error:', error.message);
      }
      return Promise.reject(error);
    }
  );

  // Authentication
  const auth = {
    login: (email, password) => apiClient.post('/api/login', { email, password }),
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete apiClient.defaults.headers.common['Authorization'];
    }
  };

  // IP Information
  const ipInfo = {
    get: (ip = null) => {
      const params = ip ? { ip } : {};
      return apiClient.get('/api/ip-info', { params });
    }
  };

  export { auth, ipInfo };
  export default apiClient;

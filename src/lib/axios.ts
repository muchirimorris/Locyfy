import axios, { type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';

// The base URL should typically come from an environment variable
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  // timeout: 10000,
});

// Request Interceptor: Attach Auth Token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Ideally, retrieve the token from a secure location (e.g., Zustand store, localStorage, or cookies)
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors globally
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {

    
    // Example: Handle 401 Unauthorized errors (e.g., token expiration)
    // You would typically try to refresh the token here before redirecting to login.
    if (error.response?.status === 401) {
      // Handle logout or refresh token logic
      console.error('Unauthorized request - redirecting or refreshing token.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

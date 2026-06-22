import axios from 'axios'; // Fixed import from 'react' to 'axios'

// Create an Axios instance with default configurations
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add an Interceptor to automatically attach Auth Tokens
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem('refresh_token');
        if (refresh) {
          const res = await axios.post(`${apiClient.defaults.baseURL}/token/refresh/`, { refresh });
          if (res.status === 200) {
            localStorage.setItem('access_token', res.data.access);
            apiClient.defaults.headers['Authorization'] = `Bearer ${res.data.access}`;
            originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        delete apiClient.defaults.headers['Authorization'];
        // Optionally dispatch event to clear zustand store, or redirect
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

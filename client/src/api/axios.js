import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // For refresh token cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 and silent refresh (placeholder logic for later)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 Unauthorized and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Implement refresh logic here in Phase 6/9
        // const res = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        // const newAccessToken = res.data.accessToken;
        // localStorage.setItem('accessToken', newAccessToken);
        // originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        // return api(originalRequest);
        
        // For now, if 401, clear token
        localStorage.removeItem('accessToken');
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

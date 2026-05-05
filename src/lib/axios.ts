import axios from 'axios';
import { getStoredAccessToken, setStoredAccessToken } from './authToken';
//import { refreshAccessToken } from '@/api/auth';

const api = axios.create({
  //baseURL: '/api',
  //baseURL: `${import.meta.env.VITE_API_URL}/api`,
  baseURL: `${import.meta.env.VITE_PRODUCTION_API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);

api.interceptors.request.use((config) => {
  const token = getStoredAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Retry once if 401, pass in two funcs
/* causing a circular dependency with the import refreshAccessToken above
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;

      try {
        const { accessToken: newToken } = await refreshAccessToken();
        setStoredAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error('Refresh token failed', err);
      }
    }

    return Promise.reject(error);
  }
);
*/

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;

      try {
        // Call directly instead of importing from auth.ts
        const res = await api.post('/auth/refresh');
        const newToken = res.data.accessToken;
        setStoredAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error('Refresh token failed', err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

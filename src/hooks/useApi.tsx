import { useAuthStore } from '../stores/authStore';
import axios from 'axios';

export const useApi = () => {
  const { accessToken, refreshToken, setAccessToken } = useAuthStore();

  const axiosInstance = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com', // Replace with the real API base URL
  });

  axiosInstance.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401) {
        try {
          const { data } = await axios.post('https://jsonplaceholder.typicode.com/posts', {
            refresh: refreshToken,
          });
          setAccessToken(data.access); // Mocking token refresh response
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};
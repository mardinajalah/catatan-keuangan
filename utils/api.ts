import axios from 'axios';
import { router } from 'expo-router';
import { getAuthToken, logoutFromFirebase } from './auth';

const DEFAULT_API_URL = 'https://api-catatan-keuangan.vercel.app/api';

const normalizeApiUrl = (url: string) => {
  const trimmedUrl = url.replace(/\/$/, '');

  return trimmedUrl.endsWith('/api') ? trimmedUrl : `${trimmedUrl}/api`;
};

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return normalizeApiUrl(process.env.EXPO_PUBLIC_API_BASE_URL);
  }

  return normalizeApiUrl(DEFAULT_API_URL);
};

export const API_BASE_URL = getBaseUrl();

if (__DEV__) {
  console.log('API Base URL:', API_BASE_URL);
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && [401, 403].includes(error.response.status)) {
      await logoutFromFirebase();
      router.replace('/login');
    }
    return Promise.reject(error);
  }
);

export default api;

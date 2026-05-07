import axios from 'axios';
import { getToken, removeToken } from './storage';
import { router } from 'expo-router';

// Gunakan IP WiFi lokal komputer agar bisa diakses baik dari Emulator maupun HP Fisik
const BASE_URL = 'http://192.168.100.111:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Tambahkan token ke setiap request
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Tangani error 401 (Unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Jika token tidak valid atau expired, hapus token dan redirect ke login
      await removeToken();
      router.replace('/login');
    }
    return Promise.reject(error);
  }
);

export default api;

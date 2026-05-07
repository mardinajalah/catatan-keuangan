import axios from 'axios';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { getAuthToken, logoutFromFirebase } from './auth';

const DEFAULT_API_URL = 'https://api-catatan-keuangan.vercel.app';

const normalizeApiUrl = (url: string) => {
  const trimmedUrl = url.replace(/\/$/, '');

  return trimmedUrl.endsWith('/api') ? trimmedUrl : `${trimmedUrl}/api`;
};

const getExpoHost = () => {
  const constants = Constants as typeof Constants & {
    manifest?: { debuggerHost?: string };
    manifest2?: { extra?: { expoClient?: { hostUri?: string } } };
  };
  const hostUri =
    Constants.expoConfig?.hostUri ||
    constants.manifest?.debuggerHost ||
    constants.manifest2?.extra?.expoClient?.hostUri;

  return hostUri?.split(':')[0];
};

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return normalizeApiUrl(process.env.EXPO_PUBLIC_API_BASE_URL);
  }

  if (!__DEV__) {
    return normalizeApiUrl(DEFAULT_API_URL);
  }

  const expoHost = getExpoHost();
  if (expoHost) {
    return `http://${expoHost}:5000/api`;
  }

  return normalizeApiUrl(DEFAULT_API_URL);
};

const BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: BASE_URL,
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
      router.replace('/(auth)/login');
    }
    return Promise.reject(error);
  }
);

export default api;

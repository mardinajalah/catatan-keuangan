import { AxiosError } from 'axios';
import { API_BASE_URL } from './api';

export const getFirebaseAuthErrorMessage = (error: unknown) => {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'Email sudah terdaftar. Silakan login atau gunakan email lain.';
    case 'auth/invalid-email':
      return 'Format email tidak valid.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email atau password salah.';
    case 'auth/weak-password':
      return 'Password terlalu lemah. Gunakan minimal 6 karakter.';
    case 'auth/network-request-failed':
      return 'Tidak bisa terhubung ke Firebase Auth. Periksa koneksi internet HP.';
    default:
      return null;
  }
};

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<{ message?: string }>;

  if (axiosError.response?.data?.message) {
    return axiosError.response.data.message;
  }

  if (axiosError.request && !axiosError.response) {
    return `Tidak bisa terhubung ke backend (${API_BASE_URL}). Periksa koneksi internet atau status backend Vercel.`;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { saveToken } from '../../utils/storage';
import AuthForm from '../../components/AuthForm';
import api from '../../utils/api';
import { loginWithFirebase, logoutFromFirebase } from '../../utils/auth';
import { getApiErrorMessage, getFirebaseAuthErrorMessage } from '../../utils/errors';

export default function LoginScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      let loginResult;

      try {
        loginResult = await loginWithFirebase({
          email: data.email,
          password: data.password,
        });
      } catch (firebaseError) {
        setError(
          getFirebaseAuthErrorMessage(firebaseError) ||
            'Login Firebase gagal. Periksa email, password, dan koneksi internet.'
        );
        return;
      }

      const { user, token } = loginResult;
      
      await saveToken(token);

      try {
        await api.post('/auth/sync-profile', {
          name: user.displayName || '',
        });
      } catch (syncError) {
        await logoutFromFirebase();
        setError(
          `Login Firebase berhasil, tetapi gagal sinkron ke backend. ${getApiErrorMessage(
            syncError,
            'Periksa konfigurasi backend Vercel.'
          )}`
        );
        return;
      }

      router.replace('/'); 
    } catch (err: any) {
      setError(getApiErrorMessage(err, 'Terjadi kesalahan saat login.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToRegister = () => {
    router.push('/register');
  };

  return (
    <AuthForm 
      type="login"
      isLoading={isLoading}
      errorMessage={error}
      onSubmit={handleLogin}
      onFooterLinkPress={handleGoToRegister}
    />
  );
}

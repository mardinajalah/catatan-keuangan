import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { saveToken } from '../../utils/storage';
import AuthForm from '../../components/AuthForm';
import api from '../../utils/api';
import { useTransactions } from '../../components/TransactionsStore';
import { loginWithFirebase } from '../../utils/auth';

export default function LoginScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshTransactions } = useTransactions();

  const handleLogin = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user, token } = await loginWithFirebase({
        email: data.email,
        password: data.password,
      });
      
      await saveToken(token);
      await api.post('/auth/sync-profile', {
        name: user.displayName || '',
      });
      await refreshTransactions();
      router.replace('/'); 
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Terjadi kesalahan koneksi server. Pastikan backend menyala.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToRegister = () => {
    router.push('/(auth)/register');
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

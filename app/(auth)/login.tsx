import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { saveToken } from '../../utils/storage';
import AuthForm from '../../components/AuthForm';
import api from '../../utils/api';
import { useTransactions } from '../../components/TransactionsStore';

export default function LoginScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshTransactions } = useTransactions();

  const handleLogin = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });
      
      if (response.data.token) {
        await saveToken(response.data.token);
        await refreshTransactions(); // Fetch new user's data before navigating
        router.replace('/'); 
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Terjadi kesalahan koneksi server. Pastikan backend menyala.');
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

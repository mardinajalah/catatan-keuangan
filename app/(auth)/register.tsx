import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import AuthForm from '../../components/AuthForm';
import api from '../../utils/api';

export default function RegisterScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      
      Alert.alert('Sukses', 'Registrasi berhasil! Silakan masuk.', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') }
      ]);
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

  const handleGoToLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <AuthForm 
      type="register"
      isLoading={isLoading}
      errorMessage={error}
      onSubmit={handleRegister}
      onFooterLinkPress={handleGoToLogin}
    />
  );
}

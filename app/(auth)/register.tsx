import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import AuthForm from '../../components/AuthForm';
import api from '../../utils/api';
import { registerWithFirebase } from '../../utils/auth';

export default function RegisterScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!data.name || !data.email || !data.password) {
        setError('Nama, email, dan password wajib diisi');
        return;
      }

      await registerWithFirebase({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      await api.post('/auth/sync-profile', { name: data.name });
      
      Alert.alert('Sukses', 'Registrasi berhasil!', [
        { text: 'OK', onPress: () => router.replace('/') }
      ]);
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

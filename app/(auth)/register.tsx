import React from 'react';
import { useRouter } from 'expo-router';
import AuthForm from '../../components/AuthForm';

export default function RegisterScreen() {
  const router = useRouter();

  const handleRegister = (data: any) => {
    // TODO: Implement actual register logic here
    console.log('Register attempt:', data);
    router.replace('/(auth)/login');
  };

  const handleGoToLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <AuthForm 
      type="register"
      onSubmit={handleRegister}
      onFooterLinkPress={handleGoToLogin}
    />
  );
}

import React from 'react';
import { useRouter } from 'expo-router';
import AuthForm from '../../components/AuthForm';

export default function LoginScreen() {
  const router = useRouter();

  const handleLogin = (data: any) => {
    // TODO: Implement actual login logic here
    console.log('Login attempt:', data);
    router.replace('/'); 
  };

  const handleGoToRegister = () => {
    router.push('/(auth)/register');
  };

  return (
    <AuthForm 
      type="login"
      onSubmit={handleLogin}
      onFooterLinkPress={handleGoToRegister}
    />
  );
}

import { auth } from '@/utils/firebase';
import { removeToken } from '@/utils/storage';
import { router, useSegments } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

type Props = {
  children: React.ReactNode;
};

const AuthLoading = () => (
  <View className="flex-1 items-center justify-center bg-[#f6f5fb] px-6">
    <ActivityIndicator color="#4E71FF" />
  </View>
);

const AuthGate: React.FC<Props> = ({ children }) => {
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsReady(true);

      if (!currentUser) {
        await removeToken();
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const isAuthRoute = segments[0] === '(auth)';
    const authScreen = segments[1];

    if (!user && !isAuthRoute) {
      router.replace('/login');
      return;
    }

    if (user && authScreen === 'login') {
      router.replace('/');
    }
  }, [isReady, segments, user]);

  if (!isReady) {
    return <AuthLoading />;
  }

  const isAuthRoute = segments[0] === '(auth)';

  if (!user && !isAuthRoute) {
    return <AuthLoading />;
  }

  if (user && segments[1] === 'login') {
    return <AuthLoading />;
  }

  return <>{children}</>;
};

export default AuthGate;

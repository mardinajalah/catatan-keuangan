import NetInfo from '@react-native-community/netinfo';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

type Props = {
  children: React.ReactNode;
};

const NetworkGuard: React.FC<Props> = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const hasConnection = state.isConnected === true && state.isInternetReachable !== false;

      setIsOnline(hasConnection);
      setIsChecking(false);
    });

    return unsubscribe;
  }, []);

  if (isChecking) {
    return (
      <View className="flex-1 items-center justify-center bg-[#f6f5fb] px-6">
        <ActivityIndicator color="#4E71FF" />
      </View>
    );
  }

  if (!isOnline) {
    return (
      <View className="flex-1 items-center justify-center bg-[#f6f5fb] px-6">
        <View className="w-full rounded-lg bg-white px-6 py-8 items-center border border-gray-100">
          <Text className="text-xl font-bold text-gray-900 mb-2">Anda sedang offline</Text>
          <Text className="text-center text-gray-500">
            Sambungkan HP ke internet untuk membuka aplikasi Catatan Keuangan.
          </Text>
        </View>
      </View>
    );
  }

  return <>{children}</>;
};

export default NetworkGuard;

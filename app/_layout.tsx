import { Stack } from 'expo-router';
import { TransactionsProvider } from '@/components/TransactionsStore';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NetworkGuard from '@/components/NetworkGuard';
import "@/global.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <NetworkGuard>
        <TransactionsProvider>
          <StatusBar barStyle='light-content' />
          <Stack screenOptions={{ headerShown: false }} />
        </TransactionsProvider>
      </NetworkGuard>
    </SafeAreaProvider>
  );
}

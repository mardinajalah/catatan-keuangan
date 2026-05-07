import { Stack } from 'expo-router';
import { TransactionsProvider } from '@/components/TransactionsStore';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AuthGate from '@/components/AuthGate';
import NetworkGuard from '@/components/NetworkGuard';
import "@/global.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <NetworkGuard>
        <AuthGate>
          <TransactionsProvider>
            <StatusBar barStyle='light-content' />
            <Stack screenOptions={{ headerShown: false }} />
          </TransactionsProvider>
        </AuthGate>
      </NetworkGuard>
    </SafeAreaProvider>
  );
}

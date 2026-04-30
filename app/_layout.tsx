import { Stack } from 'expo-router';
import { TransactionsProvider } from '@/components/TransactionsStore';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "@/global.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <TransactionsProvider>
        <StatusBar barStyle='light-content' />
        <Stack screenOptions={{ headerShown: false }} />
      </TransactionsProvider>
    </SafeAreaProvider>
  );
}

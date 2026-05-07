import MainContainer from '@/components/MainContainer';
import { router } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import { TouchableOpacity, Alert } from 'react-native';
import Laporan from './laporan';
import Pemasukan from './pemasukan';
import Pengeluaran from './pengeluaran';
import api from '../../utils/api';
import { removeToken } from '../../utils/storage';
import { useTransactions } from '@/components/TransactionsStore';

export default function Home() {
  const { clearTransactions } = useTransactions();
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Apakah Anda yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Keluar', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Panggil endpoint logout di backend
              await api.post('/auth/logout');
            } catch (error) {
              console.error('Logout error:', error);
            } finally {
              // Hapus token lokal dan bersihkan state transaksi
              await removeToken();
              clearTransactions();
              router.replace('/(auth)/login');
            }
          }
        }
      ]
    );
  };

  return (
    <MainContainer
      title='Catatan Keuangan'
      renderRightAction={() => (
        <TouchableOpacity onPress={handleLogout}>
          <LogOut size={24} color="white" />
        </TouchableOpacity>
      )}
      tabs={[
        { label: 'Pengeluaran', content: <Pengeluaran /> },
        { label: 'Pemasukan', content: <Pemasukan /> },
        { label: 'Laporan', content: <Laporan /> },
      ]}
      onFabPress={(active) => {
        if (active === 0) {
          router.push({
            pathname: '/(tambahCatatan)',
            params: { tab: '0' },
          });
        }

        if (active === 1) {
          router.push({
            pathname: '/(tambahCatatan)',
            params: { tab: '1' },
          });
        }
      }}
    />
  );
}

import MainContainer from '@/components/MainContainer';
import { router } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import CustomModal from '../../components/CustomModal';
import Laporan from './laporan';
import Pemasukan from './pemasukan';
import Pengeluaran from './pengeluaran';
import { useTransactions } from '@/components/TransactionsStore';
import { logoutFromFirebase } from '../../utils/auth';

export default function Home() {
  const { clearTransactions } = useTransactions();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const executeLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutFromFirebase();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
      clearTransactions();
      router.replace('/login');
    }
  };

  return (
    <>
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

      {/* Modal Logout */}
      <CustomModal
        visible={showLogoutModal}
        type={isLoggingOut ? 'loading' : 'confirm'}
        title={isLoggingOut ? 'Memproses' : 'Keluar Akun'}
        message={isLoggingOut ? 'Sedang keluar...' : 'Apakah Anda yakin ingin keluar dari aplikasi?'}
        icon={!isLoggingOut ? <LogOut size={48} color="#EF4444" className="mb-4" /> : undefined}
        loadingColor="#EF4444"
        primaryButtonText={!isLoggingOut ? 'Ya, Keluar' : undefined}
        onPrimaryPress={!isLoggingOut ? executeLogout : undefined}
        primaryButtonVariant="danger"
        secondaryButtonText={!isLoggingOut ? 'Batal' : undefined}
        onSecondaryPress={!isLoggingOut ? () => setShowLogoutModal(false) : undefined}
        secondaryButtonVariant="gray"
      />
    </>
  );
}

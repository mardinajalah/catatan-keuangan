import MainContainer from '@/components/MainContainer';
import { router } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import { TouchableOpacity, Modal, View, Text, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
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
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-6 items-center w-[80%] max-w-sm shadow-xl">
            {isLoggingOut ? (
              <ActivityIndicator size="large" color="#EF4444" className="mb-4" />
            ) : (
              <LogOut size={48} color="#EF4444" className="mb-4" />
            )}
            
            <Text className="text-xl font-bold text-[#222] text-center mb-2">
              {isLoggingOut ? 'Memproses' : 'Keluar Akun'}
            </Text>
            
            <Text className="text-base text-[#666] text-center mb-6">
              {isLoggingOut ? 'Sedang keluar...' : 'Apakah Anda yakin ingin keluar dari aplikasi?'}
            </Text>

            {!isLoggingOut && (
              <View className="flex-row w-full gap-3">
                <TouchableOpacity
                  onPress={() => setShowLogoutModal(false)}
                  className="flex-1 bg-gray-100 rounded-xl py-3 items-center"
                >
                  <Text className="text-gray-700 font-bold text-base">Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={executeLogout}
                  className="flex-1 bg-[#EF4444] rounded-xl py-3 items-center"
                >
                  <Text className="text-white font-bold text-base">Ya, Keluar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

import MainContainer from '@/components/MainContainer';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import FormPengeluaran from './formPengeluaran';
import FormPemasukan from './formPemasukan';

export default function TambahCatatan() {
  const router = useRouter();
  const { tab } = useLocalSearchParams();

  const [initialTab, setInitialTab] = useState(0);

  useEffect(() => {
    if (tab === '1') {
      setInitialTab(1);
    } else {
      setInitialTab(0);
    }
  }, [tab]);

  return (
    <MainContainer
      title="Tambah Catatan"
      showBackButton
      onBackPress={() => router.back()}
      initialActiveTab={initialTab} // ⬅️ penting
      tabs={[
        { label: 'Pengeluaran', content: <FormPengeluaran /> },
        { label: 'Pemasukan', content: <FormPemasukan /> },
      ]}
    />
  );
}
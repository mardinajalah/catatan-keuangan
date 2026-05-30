import MainContainer from '@/components/MainContainer';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import FormPemasukan from '@/components/tabs/formPemasukan';
import FormPengeluaran from '@/components/tabs/formPengeluaran';

export default function TambahCatatan() {
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
      initialActiveTab={initialTab}
      tabs={[
        { label: 'Pengeluaran', content: <FormPengeluaran /> },
        { label: 'Pemasukan', content: <FormPemasukan /> },
      ]}
    />
  );
}

import MainContainer from '@/components/MainContainer';
import FormPengeluaran from './formPengeluaran';
import FormPemasukan from './formPemasukan';
import { useLocalSearchParams } from 'expo-router';

export default function TambahCatatan() {
  const { tab } = useLocalSearchParams();

  const initialTab = tab === '1' ? 1 : 0;

  return (
    <MainContainer
      title="Tambah Catatan"
      tabs={[
        { label: 'Pengeluaran', content: <FormPengeluaran /> },
        { label: 'Pemasukan', content: <FormPemasukan /> },
      ]}
    />
  );
}
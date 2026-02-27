import MainContainer from '@/components/MainContainer';
import { router } from 'expo-router';
import Laporan from './laporan';
import Pemasukan from './pemasukan';
import Pengeluaran from './pengeluaran';

export default function Home() {
  return (
    <MainContainer
      title='Catatan Keuangan'
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

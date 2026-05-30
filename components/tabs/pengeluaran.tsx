import DayGroup from '@/components/dayGroup';
import { TransactionListSkeleton } from '@/components/Skeleton';
import { groupTransactionsByDate, useTransactions } from '@/components/TransactionsStore';
import { BanknoteArrowUp } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import CustomModal from '@/components/CustomModal';

const Pengeluaran: React.FC = () => {
  const { expenses, isLoading, refreshTransactions } = useTransactions();
  const groups = useMemo(() => groupTransactionsByDate(expenses), [expenses]);
  const [noteModal, setNoteModal] = useState({ visible: false, note: '' });

  if (isLoading) {
    return <TransactionListSkeleton />;
  }

  return (
    <View className='flex-1 pt-3'>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingVertical: 12 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshTransactions}
            tintColor='#4E71FF'
            colors={['#4E71FF']}
          />
        }
      >
        {groups.map((group) => (
          <DayGroup
            key={group.id}
            dateLabel={group.dateLabel}
            total={group.total}
            items={group.items.map((item) => ({
              id: item.id,
              title: item.title,
              description: item.category,
              amount: item.amount,
              Icon: BanknoteArrowUp,
              onPress: () => setNoteModal({ visible: true, note: item.note || '' }),
            }))}
          />
        ))}

        {groups.length === 0 && (
          <View className='mx-5 bg-white rounded-lg p-5'>
            <Text className='text-[#222] font-bold text-base'>Belum ada pengeluaran</Text>
            <Text className='text-[#666] mt-1'>Transaksi pengeluaran yang disimpan akan tampil di sini.</Text>
          </View>
        )}
      </ScrollView>

      <CustomModal
        visible={noteModal.visible}
        type='info'
        title='Deskripsi Transaksi'
        message={noteModal.note.length === 0 ? 'tidak ada deskripsi' : noteModal.note}
        primaryButtonText='Tutup'
        onPrimaryPress={() => setNoteModal({ visible: false, note: '' })}
      />
    </View>
  );
};

export default Pengeluaran;

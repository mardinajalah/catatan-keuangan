import DayGroup from '@/components/dayGroup';
import { TransactionListSkeleton } from '@/components/Skeleton';
import { groupTransactionsByDate, useTransactions } from '@/components/TransactionsStore';
import { BanknoteArrowDown } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';

const Pemasukan: React.FC = () => {
  const { incomes, isLoading, refreshTransactions } = useTransactions();
  const groups = useMemo(() => groupTransactionsByDate(incomes), [incomes]);

  if (isLoading) {
    return <TransactionListSkeleton />;
  }

  return (
    <View className='flex-1 pt-3'>
      <ScrollView
        contentContainerStyle={{ gap: 10, paddingVertical: 12 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshTransactions}
            tintColor="#4E71FF"
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
              description: item.note || item.category,
              amount: item.amount,
              Icon: BanknoteArrowDown,
            }))}
          />
        ))}

        {groups.length === 0 && (
          <View className='mx-5 bg-white rounded-lg p-5'>
            <Text className='text-[#222] font-bold text-base'>Belum ada pemasukan</Text>
            <Text className='text-[#666] mt-1'>Transaksi pemasukan yang disimpan akan tampil di sini.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Pemasukan;

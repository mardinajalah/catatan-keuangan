import DayGroup from '@/components/dayGroup';
import { groupTransactionsByDate, useTransactions } from '@/components/TransactionsStore';
import { BanknoteArrowUp } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { ScrollView, Text, View, ActivityIndicator } from 'react-native';

const Pengeluaran: React.FC = () => {
  const { expenses, isLoading } = useTransactions();
  const groups = useMemo(() => groupTransactionsByDate(expenses), [expenses]);

  if (isLoading && expenses.length === 0) {
    return (
      <View className='flex-1 justify-center items-center'>
        <ActivityIndicator size="large" color="#4E71FF" />
      </View>
    );
  }

  return (
    <View className='flex-1 pt-3'>
      <ScrollView contentContainerStyle={{ gap: 10, paddingVertical: 12 }}>
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
              Icon: BanknoteArrowUp,
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
    </View>
  );
};

export default Pengeluaran;

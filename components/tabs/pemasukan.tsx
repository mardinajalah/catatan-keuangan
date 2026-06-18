import DayGroup from '@/components/dayGroup';
import { TransactionListSkeleton } from '@/components/Skeleton';
import { groupTransactionsByDate, useTransactions, Transaction } from '@/components/TransactionsStore';
import { BanknoteArrowDown } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import TransactionDetailModal from '@/components/TransactionDetailModal';

const Pemasukan: React.FC = () => {
  const { incomes, isLoading, refreshTransactions, updateTransaction, deleteTransaction } = useTransactions();
  const groups = useMemo(() => groupTransactionsByDate(incomes), [incomes]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

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
              Icon: BanknoteArrowDown,
              onPress: () => setSelectedTransaction(item),
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

      <TransactionDetailModal
        visible={selectedTransaction !== null}
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        onEdit={async (tx, updatedData) => {
          await updateTransaction(tx.id, updatedData);
        }}
        onDelete={async (tx) => {
          await deleteTransaction(tx.id);
        }}
      />
    </View>
  );
};

export default Pemasukan;

import {
  formatMonthLabel,
  getCurrentDateInput,
  getTransactionMonth,
  Transaction,
  useTransactions,
} from '@/components/TransactionsStore';
import { LaporanSkeleton } from '@/components/Skeleton';
import { getCategoryKey, normalizeCategory } from '@/utils/category';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  CircleDollarSign,
  Download,
  ReceiptText,
} from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import CustomModal, { CustomModalType } from '../../components/CustomModal';

const formatCurrency = (value: number) => {
  return 'Rp' + value.toLocaleString('id-ID');
};

const escapeCsvValue = (value: string | number) => {
  const text = String(value).replace(/"/g, '""');
  return `"${text}"`;
};

const createExpenseCsv = (expenses: Transaction[]) => {
  const headers = ['Tanggal', 'Judul', 'Kategori', 'Catatan', 'Nominal'];
  const rows = expenses.map((item) => [
    item.date,
    item.title,
    item.category,
    item.note,
    item.amount,
  ]);

  return [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(','))
    .join('\n');
};

const getCategoryReports = (expenses: Transaction[]) => {
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  const grouped = expenses.reduce<Record<string, { name: string; amount: number }>>((result, item) => {
    const key = getCategoryKey(item.category);
    const name = normalizeCategory(item.category);

    if (!result[key]) {
      result[key] = { name, amount: 0 };
    }

    result[key].amount += item.amount;

    return result;
  }, {});

  return Object.values(grouped).map(({ name, amount }, index) => ({
    name,
    amount,
    percent: total > 0 ? Math.round((amount / total) * 100) : 0,
    color: index % 2 === 0 ? '#5409DA' : '#4E71FF',
  }));
};

const SummaryMetric = ({
  title,
  value,
  caption,
}: {
  title: string;
  value: number;
  caption: string;
}) => (
  <View className='flex-1 rounded-lg bg-white/15 px-3 py-3'>
    <Text className='text-white/70 text-xs font-semibold'>{title}</Text>
    <Text className='text-white font-bold mt-1'>{formatCurrency(value)}</Text>
    <Text className='text-white/60 text-xs mt-1'>{caption}</Text>
  </View>
);

const Laporan = () => {
  const { transactions, incomes, expenses, isLoading, refreshTransactions } = useTransactions();
  const currentMonth = getCurrentDateInput().slice(0, 7);

  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    type: CustomModalType;
    title: string;
    message: string;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showModal = (type: CustomModalType, title: string, message: string) => {
    setModalConfig({ visible: true, type, title, message });
  };

  const months = useMemo(() => {
    const transactionMonths = Array.from(
      new Set(transactions.map((transaction) => getTransactionMonth(transaction.date))),
    ).sort((a, b) => b.localeCompare(a));

    return transactionMonths.length > 0 ? transactionMonths : [currentMonth];
  }, [currentMonth, transactions]);

  const [selectedMonth, setSelectedMonth] = useState(months[0]);

  useEffect(() => {
    if (!months.includes(selectedMonth)) {
      setSelectedMonth(months[0]);
    }
  }, [months, selectedMonth]);

  const selectedMonthLabel = formatMonthLabel(selectedMonth);

  const selectedIncomes = useMemo(
    () => incomes.filter((item) => getTransactionMonth(item.date) === selectedMonth),
    [incomes, selectedMonth],
  );

  const selectedExpenses = useMemo(
    () => expenses.filter((item) => getTransactionMonth(item.date) === selectedMonth),
    [expenses, selectedMonth],
  );

  const incomeTotal = selectedIncomes.reduce((sum, item) => sum + item.amount, 0);
  const expenseTotal = selectedExpenses.reduce((sum, item) => sum + item.amount, 0);
  const balanceTotal = incomeTotal - expenseTotal;
  const categoryReports = getCategoryReports(selectedExpenses);
  const recentExpenses = selectedExpenses.slice(0, 5);
  const balanceInsight =
    balanceTotal >= 0
      ? 'Saldo bulan ini masih positif.'
      : 'Pengeluaran bulan ini lebih besar dari pemasukan.';

  const monthlyBars = months.slice(0, 4).reverse().map((month) => {
    const income = incomes
      .filter((item) => getTransactionMonth(item.date) === month)
      .reduce((sum, item) => sum + item.amount, 0);
    const expense = expenses
      .filter((item) => getTransactionMonth(item.date) === month)
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      label: formatMonthLabel(month).split(' ')[0],
      income: income > 0 ? Math.min(64, Math.max(18, Math.round(income / 8000))) : 4,
      expense: expense > 0 ? Math.min(64, Math.max(18, Math.round(expense / 2000))) : 4,
    };
  });

  if (isLoading) {
    return <LaporanSkeleton />;
  }

  const handleExportCsv = async () => {
    if (selectedExpenses.length === 0) {
      showModal('warning', 'Tidak ada data', `Belum ada pengeluaran untuk ${selectedMonthLabel}.`);
      return;
    }

    const csv = createExpenseCsv(selectedExpenses);
    const fileName = `laporan-pengeluaran-${selectedMonth}.csv`;
    const file = new File(Paths.document, fileName);
    file.create({ overwrite: true });
    file.write(csv);

    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      showModal('success', 'Export berhasil', `File tersimpan di ${file.uri}`);
      return;
    }

    await Sharing.shareAsync(file.uri, {
      mimeType: 'text/csv',
      dialogTitle: `Export ${selectedMonthLabel}`,
      UTI: 'public.comma-separated-values-text',
    });
  };

  return (
    <View className='flex-1 pt-3'>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12, gap: 12 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshTransactions}
            tintColor="#4E71FF"
            colors={['#4E71FF']}
          />
        }
      >
        <View className='bg-white rounded-lg p-4'>
          <View className='flex-row items-center justify-between gap-3 mb-3'>
            <View className='flex-row items-center gap-2'>
              <CalendarDays
                color='#5409DA'
                size={20}
              />
              <Text className='text-[#222] font-bold text-base'>Periode Laporan</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleExportCsv}
              className='bg-[#5409DA] rounded-full px-3 py-2 flex-row items-center gap-1.5'
            >
              <Download
                color='white'
                size={14}
              />
              <Text className='text-white font-bold text-xs'>CSV</Text>
            </TouchableOpacity>
          </View>

          <View className='flex-row flex-wrap gap-2'>
            {months.map((month) => {
              const isActive = month === selectedMonth;
              return (
                <TouchableOpacity
                  key={month}
                  activeOpacity={0.8}
                  onPress={() => setSelectedMonth(month)}
                  className={`rounded-full px-4 py-2.5 items-center ${isActive ? 'bg-[#4E71FF]' : 'bg-[#f6f5fb]'}`}
                >
                  <Text className={`font-bold text-xs ${isActive ? 'text-white' : 'text-[#5409DA]'}`}>
                    {formatMonthLabel(month)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className='bg-[#4E71FF] rounded-lg p-5'>
          <View className='flex-row items-center justify-between gap-4'>
            <View className='flex-1'>
              <Text className='text-white/80 font-semibold'>Ringkasan {selectedMonthLabel}</Text>
              <Text className='text-white text-3xl font-bold mt-2'>{formatCurrency(balanceTotal)}</Text>
              <Text className='text-white/70 text-xs mt-2'>{balanceInsight}</Text>
            </View>
            <View className='w-12 h-12 rounded-full bg-white/20 items-center justify-center'>
              <CircleDollarSign
                color='white'
                size={26}
              />
            </View>
          </View>

          <View className='flex-row gap-3 mt-4'>
            <SummaryMetric
              title='Pemasukan'
              value={incomeTotal}
              caption={`${selectedIncomes.length} transaksi`}
            />
            <SummaryMetric
              title='Pengeluaran'
              value={expenseTotal}
              caption={`${selectedExpenses.length} transaksi`}
            />
          </View>
        </View>

        <View className='bg-white rounded-lg p-4'>
          <View className='flex-row items-center justify-between mb-4'>
            <View className='flex-row items-center gap-2'>
              <ChartNoAxesColumnIncreasing
                color='#5409DA'
                size={20}
              />
              <Text className='text-[#222] font-bold text-base'>Tren 4 Bulan</Text>
            </View>
            <Text className='text-[#666] text-xs'>{months.length} bulan</Text>
          </View>

          <View className='flex-row items-end justify-between h-24'>
            {monthlyBars.map((item) => (
              <View
                key={item.label}
                className='items-center flex-1'
              >
                <View className='h-16 flex-row items-end gap-1'>
                  <View
                    className='w-3 rounded-full bg-[#4E71FF]'
                    style={{ height: item.income }}
                  />
                  <View
                    className='w-3 rounded-full bg-[#5409DA]'
                    style={{ height: item.expense }}
                  />
                </View>
                <Text className='text-[#666] text-xs mt-2'>{item.label}</Text>
              </View>
            ))}
          </View>

          <View className='flex-row gap-4 mt-4'>
            <View className='flex-row items-center gap-2'>
              <View className='w-3 h-3 rounded-full bg-[#4E71FF]' />
              <Text className='text-[#666] text-xs'>Masuk</Text>
            </View>
            <View className='flex-row items-center gap-2'>
              <View className='w-3 h-3 rounded-full bg-[#5409DA]' />
              <Text className='text-[#666] text-xs'>Keluar</Text>
            </View>
          </View>
        </View>

        <View className='bg-white rounded-lg p-4 mb-4'>
          <View className='flex-row items-center justify-between mb-4'>
            <View className='flex-row items-center gap-2'>
              <ReceiptText
                color='#5409DA'
                size={20}
              />
              <Text className='text-[#222] font-bold text-base'>Pengeluaran</Text>
            </View>
            <Text className='text-[#666] text-xs'>{selectedExpenses.length} transaksi</Text>
          </View>

          {categoryReports.length > 0 ? (
            <View className='gap-4'>
              {categoryReports.map((item) => (
                <View key={item.name}>
                  <View className='flex-row items-center justify-between mb-2'>
                    <Text className='text-[#222] font-semibold'>{item.name}</Text>
                    <Text className='text-[#222] font-bold'>{formatCurrency(item.amount)}</Text>
                  </View>
                  <View className='h-3 rounded-full bg-[#f6f5fb] overflow-hidden'>
                    <View
                      className='h-full rounded-full'
                      style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                    />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text className='text-[#666] leading-5'>Belum ada data pengeluaran untuk bulan ini.</Text>
          )}

          <View className='h-px bg-[#f0eef8] my-4' />

          <View className='flex-row items-center justify-between mb-3'>
            <Text className='text-[#222] font-bold'>Transaksi Terbaru</Text>
            {selectedExpenses.length > recentExpenses.length && (
              <Text className='text-[#666] text-xs'>5 terbaru</Text>
            )}
          </View>

          <View className='gap-3'>
            {recentExpenses.map((item, index) => (
              <View key={item.id} className={index === recentExpenses.length - 1 ? '' : 'border-b border-[#f0eef8] pb-3'}>
                <View className='flex-row justify-between gap-3'>
                  <View className='flex-1'>
                    <Text className='text-[#222] font-bold'>{item.title}</Text>
                    <Text className='text-[#666] text-xs mt-1'>
                      {item.date} - {item.category}
                    </Text>
                  </View>
                  <Text className='text-[#222] font-bold'>{formatCurrency(item.amount)}</Text>
                </View>
                {!!item.note && <Text className='text-[#666] text-xs mt-1'>{item.note}</Text>}
              </View>
            ))}

            {recentExpenses.length === 0 && (
              <Text className='text-[#666] leading-5'>Tidak ada pengeluaran yang bisa ditampilkan.</Text>
            )}
          </View>
        </View>
      </ScrollView>

      <CustomModal
        visible={modalConfig.visible}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        primaryButtonText="OK"
        onPrimaryPress={() => setModalConfig((prev) => ({ ...prev, visible: false }))}
        primaryButtonVariant="primary"
      />
    </View>
  );
};

export default Laporan;

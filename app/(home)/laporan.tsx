import {
  formatMonthLabel,
  getCurrentDateInput,
  getTransactionMonth,
  Transaction,
  useTransactions,
} from '@/components/TransactionsStore';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  CircleDollarSign,
  Download,
  ReceiptText,
  WalletCards,
} from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

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
  const grouped = expenses.reduce<Record<string, number>>((result, item) => {
    result[item.category] = (result[item.category] ?? 0) + item.amount;
    return result;
  }, {});

  return Object.entries(grouped).map(([name, amount], index) => ({
    name,
    amount,
    percent: total > 0 ? Math.round((amount / total) * 100) : 0,
    color: index % 2 === 0 ? '#5409DA' : '#4E71FF',
  }));
};

const ReportCard = ({
  title,
  value,
  caption,
  Icon,
  accent,
}: {
  title: string;
  value: number;
  caption: string;
  Icon: React.ComponentType<any>;
  accent: string;
}) => (
  <View className='bg-white rounded-lg p-4 flex-1'>
    <View className='flex-row items-center justify-between mb-4'>
      <View
        className='w-10 h-10 rounded-full items-center justify-center'
        style={{ backgroundColor: `${accent}18` }}
      >
        <Icon
          color={accent}
          size={20}
        />
      </View>
      <Text className='text-[#666] text-xs font-semibold'>{title}</Text>
    </View>
    <Text className='text-[#222] text-lg font-bold'>{formatCurrency(value)}</Text>
    <Text className='text-[#666] text-xs mt-1'>{caption}</Text>
  </View>
);

const Laporan = () => {
  const { transactions, incomes, expenses } = useTransactions();
  const currentMonth = getCurrentDateInput().slice(0, 7);

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

  const monthlyBars = months.slice(0, 4).reverse().map((month) => {
    const income = incomes
      .filter((item) => getTransactionMonth(item.date) === month)
      .reduce((sum, item) => sum + item.amount, 0);
    const expense = expenses
      .filter((item) => getTransactionMonth(item.date) === month)
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      label: formatMonthLabel(month).split(' ')[0],
      income: income > 0 ? Math.max(18, Math.round(income / 8000)) : 4,
      expense: expense > 0 ? Math.max(18, Math.round(expense / 2000)) : 4,
    };
  });

  const insights = [
    selectedExpenses.length > 0
      ? `Ada ${selectedExpenses.length} pengeluaran di ${selectedMonthLabel}.`
      : `Belum ada pengeluaran di ${selectedMonthLabel}.`,
    balanceTotal >= 0
      ? 'Saldo masih positif karena pemasukan lebih besar dari pengeluaran.'
      : 'Pengeluaran bulan ini lebih besar dari pemasukan.',
    'Data ini masih sementara dan akan hilang jika aplikasi direfresh.',
  ];

  const handleExportCsv = async () => {
    if (selectedExpenses.length === 0) {
      Alert.alert('Tidak ada data', `Belum ada pengeluaran untuk ${selectedMonthLabel}.`);
      return;
    }

    const csv = createExpenseCsv(selectedExpenses);
    const fileName = `laporan-pengeluaran-${selectedMonth}.csv`;
    const file = new File(Paths.document, fileName);
    file.create({ overwrite: true });
    file.write(csv);

    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      Alert.alert('Export berhasil', `File tersimpan di ${file.uri}`);
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
      >
        <View className='bg-[#4E71FF] rounded-lg p-5'>
          <View className='flex-row items-center justify-between'>
            <View>
              <Text className='text-white/80 font-semibold'>Ringkasan {selectedMonthLabel}</Text>
              <Text className='text-white text-3xl font-bold mt-2'>{formatCurrency(balanceTotal)}</Text>
            </View>
            <View className='w-12 h-12 rounded-full bg-white/20 items-center justify-center'>
              <CircleDollarSign
                color='white'
                size={26}
              />
            </View>
          </View>

          <View className='h-px bg-white/20 my-4' />

          <View className='flex-row justify-between'>
            <View>
              <Text className='text-white/70 text-xs'>Pemasukan</Text>
              <Text className='text-white font-bold mt-1'>{formatCurrency(incomeTotal)}</Text>
            </View>
            <View className='items-end'>
              <Text className='text-white/70 text-xs'>Pengeluaran</Text>
              <Text className='text-white font-bold mt-1'>{formatCurrency(expenseTotal)}</Text>
            </View>
          </View>
        </View>

        <View className='bg-white rounded-lg p-4'>
          <View className='flex-row items-center gap-2 mb-3'>
            <CalendarDays
              color='#5409DA'
              size={20}
            />
            <Text className='text-[#222] font-bold text-base'>Pilih Bulan Export</Text>
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

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleExportCsv}
            className='mt-4 bg-[#5409DA] rounded-lg py-3.5 flex-row items-center justify-center gap-2'
          >
            <Download
              color='white'
              size={18}
            />
            <Text className='text-white font-bold'>Export Pengeluaran CSV</Text>
          </TouchableOpacity>
        </View>

        <View className='flex-row gap-3'>
          <ReportCard
            title='Pemasukan'
            value={incomeTotal}
            caption={`${selectedIncomes.length} transaksi tercatat`}
            Icon={ArrowDownLeft}
            accent='#16a34a'
          />
          <ReportCard
            title='Pengeluaran'
            value={expenseTotal}
            caption={`${selectedExpenses.length} transaksi tercatat`}
            Icon={ArrowUpRight}
            accent='#ef4444'
          />
        </View>

        <ReportCard
          title='Saldo Bersih'
          value={balanceTotal}
          caption={`Sisa dari ${selectedMonthLabel}`}
          Icon={WalletCards}
          accent='#4E71FF'
        />

        <View className='bg-white rounded-lg p-4'>
          <View className='flex-row items-center justify-between mb-4'>
            <View className='flex-row items-center gap-2'>
              <ChartNoAxesColumnIncreasing
                color='#5409DA'
                size={20}
              />
              <Text className='text-[#222] font-bold text-base'>Grafik Bulanan</Text>
            </View>
            <Text className='text-[#666] text-xs'>{months.length} bulan</Text>
          </View>

          <View className='flex-row items-end justify-between h-32'>
            {monthlyBars.map((item) => (
              <View
                key={item.label}
                className='items-center flex-1'
              >
                <View className='h-24 flex-row items-end gap-1'>
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

        <View className='bg-white rounded-lg p-4'>
          <View className='flex-row items-center gap-2 mb-4'>
            <ReceiptText
              color='#5409DA'
              size={20}
            />
            <Text className='text-[#222] font-bold text-base'>Kategori Pengeluaran</Text>
          </View>

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

            {categoryReports.length === 0 && (
              <Text className='text-[#666] leading-5'>Belum ada data pengeluaran untuk bulan ini.</Text>
            )}
          </View>
        </View>

        <View className='bg-white rounded-lg p-4'>
          <Text className='text-[#222] font-bold text-base mb-3'>Data Pengeluaran</Text>

          <View className='gap-3'>
            {selectedExpenses.map((item) => (
              <View
                key={item.id}
                className='border-b border-[#f0eef8] pb-3'
              >
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

            {selectedExpenses.length === 0 && (
              <Text className='text-[#666] leading-5'>Tidak ada pengeluaran yang bisa diexport.</Text>
            )}
          </View>
        </View>

        <View className='bg-white rounded-lg p-4 mb-4'>
          <View className='flex-row items-center gap-2 mb-3'>
            <CalendarDays
              color='#5409DA'
              size={20}
            />
            <Text className='text-[#222] font-bold text-base'>Catatan Laporan</Text>
          </View>

          <View className='gap-3'>
            {insights.map((item, index) => (
              <View
                key={item}
                className='flex-row gap-3'
              >
                <View className='w-7 h-7 rounded-full bg-[#f6f5fb] items-center justify-center'>
                  <Text className='text-[#5409DA] font-bold text-xs'>{index + 1}</Text>
                </View>
                <Text className='text-[#666] flex-1 leading-5'>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Laporan;

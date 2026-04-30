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
import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

type ExpenseReport = {
  id: string;
  date: string;
  month: string;
  title: string;
  category: string;
  note: string;
  amount: number;
};

const incomeReports = [
  { id: 'in-1', month: '2026-02', amount: 350000 },
  { id: 'in-2', month: '2026-02', amount: 350000 },
  { id: 'in-3', month: '2026-03', amount: 500000 },
  { id: 'in-4', month: '2026-04', amount: 650000 },
];

const expenseReports: ExpenseReport[] = [
  {
    id: 'out-1',
    date: '2026-02-21',
    month: '2026-02',
    title: 'Beli Rokok',
    category: 'Rokok',
    note: 'Warkop 1 bungkus',
    amount: 17000,
  },
  {
    id: 'out-2',
    date: '2026-02-21',
    month: '2026-02',
    title: 'Beli Nasi',
    category: 'Makanan',
    note: 'Nasi 1 porsi',
    amount: 20000,
  },
  {
    id: 'out-3',
    date: '2026-02-20',
    month: '2026-02',
    title: 'Beli Nasi',
    category: 'Makanan',
    note: 'Nasi 1 porsi',
    amount: 20000,
  },
  {
    id: 'out-4',
    date: '2026-03-04',
    month: '2026-03',
    title: 'Paket Data',
    category: 'Internet',
    note: 'Kuota bulanan',
    amount: 65000,
  },
  {
    id: 'out-5',
    date: '2026-04-12',
    month: '2026-04',
    title: 'Belanja Dapur',
    category: 'Kebutuhan',
    note: 'Sayur dan beras',
    amount: 125000,
  },
];

const months = [
  { label: 'Feb 2026', value: '2026-02' },
  { label: 'Mar 2026', value: '2026-03' },
  { label: 'Apr 2026', value: '2026-04' },
];

const formatCurrency = (value: number) => {
  return 'Rp' + value.toLocaleString('id-ID');
};

const escapeCsvValue = (value: string | number) => {
  const text = String(value).replace(/"/g, '""');
  return `"${text}"`;
};

const createExpenseCsv = (expenses: ExpenseReport[]) => {
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

const getCategoryReports = (expenses: ExpenseReport[]) => {
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

const monthlyBars = months.map((month) => {
  const income = incomeReports
    .filter((item) => item.month === month.value)
    .reduce((sum, item) => sum + item.amount, 0);
  const expense = expenseReports
    .filter((item) => item.month === month.value)
    .reduce((sum, item) => sum + item.amount, 0);

  return {
    label: month.label.split(' ')[0],
    income: Math.max(18, Math.round(income / 8000)),
    expense: Math.max(18, Math.round(expense / 2000)),
  };
});

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
  const [selectedMonth, setSelectedMonth] = useState(months[0].value);

  const selectedMonthLabel = months.find((item) => item.value === selectedMonth)?.label ?? '';

  const selectedIncomes = useMemo(
    () => incomeReports.filter((item) => item.month === selectedMonth),
    [selectedMonth],
  );

  const selectedExpenses = useMemo(
    () => expenseReports.filter((item) => item.month === selectedMonth),
    [selectedMonth],
  );

  const incomeTotal = selectedIncomes.reduce((sum, item) => sum + item.amount, 0);
  const expenseTotal = selectedExpenses.reduce((sum, item) => sum + item.amount, 0);
  const balanceTotal = incomeTotal - expenseTotal;
  const categoryReports = getCategoryReports(selectedExpenses);

  const insights = [
    selectedExpenses.length > 0
      ? `Ada ${selectedExpenses.length} pengeluaran di ${selectedMonthLabel}.`
      : `Belum ada pengeluaran di ${selectedMonthLabel}.`,
    balanceTotal >= 0
      ? 'Saldo masih positif karena pemasukan lebih besar dari pengeluaran.'
      : 'Pengeluaran bulan ini lebih besar dari pemasukan.',
    'Export CSV bisa dibuka di Excel, Google Sheets, atau aplikasi spreadsheet lain.',
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

          <View className='flex-row gap-2'>
            {months.map((month) => {
              const isActive = month.value === selectedMonth;
              return (
                <TouchableOpacity
                  key={month.value}
                  activeOpacity={0.8}
                  onPress={() => setSelectedMonth(month.value)}
                  className={`flex-1 rounded-full py-2.5 items-center ${isActive ? 'bg-[#4E71FF]' : 'bg-[#f6f5fb]'}`}
                >
                  <Text className={`font-bold text-xs ${isActive ? 'text-white' : 'text-[#5409DA]'}`}>
                    {month.label}
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
                      {item.date} • {item.category}
                    </Text>
                  </View>
                  <Text className='text-[#222] font-bold'>{formatCurrency(item.amount)}</Text>
                </View>
                <Text className='text-[#666] text-xs mt-1'>{item.note}</Text>
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

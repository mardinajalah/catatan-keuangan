import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  CircleDollarSign,
  ReceiptText,
  WalletCards,
} from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const incomeTotal = 700000;
const expenseTotal = 57000;
const balanceTotal = incomeTotal - expenseTotal;

const formatCurrency = (value: number) => {
  return 'Rp' + value.toLocaleString('id-ID');
};

const summaryCards = [
  {
    title: 'Saldo Bersih',
    value: balanceTotal,
    caption: 'Sisa dari pemasukan bulan ini',
    Icon: WalletCards,
    accent: '#4E71FF',
  },
  {
    title: 'Pemasukan',
    value: incomeTotal,
    caption: '2 transaksi tercatat',
    Icon: ArrowDownLeft,
    accent: '#16a34a',
  },
  {
    title: 'Pengeluaran',
    value: expenseTotal,
    caption: '3 transaksi tercatat',
    Icon: ArrowUpRight,
    accent: '#ef4444',
  },
];

const categoryReports = [
  { name: 'Makanan', amount: 40000, percent: 70, color: '#5409DA' },
  { name: 'Rokok', amount: 17000, percent: 30, color: '#4E71FF' },
];

const monthlyBars = [
  { label: 'Jan', income: 45, expense: 28 },
  { label: 'Feb', income: 92, expense: 18 },
  { label: 'Mar', income: 58, expense: 36 },
  { label: 'Apr', income: 76, expense: 42 },
];

const insights = [
  'Pengeluaran terbesar bulan ini ada di kategori Makanan.',
  'Saldo masih positif karena pemasukan lebih besar dari pengeluaran.',
  'Catat transaksi setiap hari agar laporan makin akurat.',
];

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

const Laporan = () => (
  <View className='flex-1 pt-3'>
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12, gap: 12 }}
    >
      <View className='bg-[#4E71FF] rounded-lg p-5'>
        <View className='flex-row items-center justify-between'>
          <View>
            <Text className='text-white/80 font-semibold'>Ringkasan Bulan Ini</Text>
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

      <View className='flex-row gap-3'>
        <ReportCard {...summaryCards[1]} />
        <ReportCard {...summaryCards[2]} />
      </View>

      <ReportCard {...summaryCards[0]} />

      <View className='bg-white rounded-lg p-4'>
        <View className='flex-row items-center justify-between mb-4'>
          <View className='flex-row items-center gap-2'>
            <ChartNoAxesColumnIncreasing
              color='#5409DA'
              size={20}
            />
            <Text className='text-[#222] font-bold text-base'>Grafik Bulanan</Text>
          </View>
          <Text className='text-[#666] text-xs'>4 bulan</Text>
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

export default Laporan;

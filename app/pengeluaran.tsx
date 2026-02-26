import DayGroup from '@/components/dayGroup';
import { BanknoteArrowUp } from 'lucide-react-native';
import React from 'react';
import { ScrollView, View } from 'react-native';

const data = [
  {
    id: '2026-02-21',
    dateLabel: 'Sabtu, 21 Feb 2026',
    total: 37000,
    items: [
      { id: 1, title: 'Uang Keluar', description: 'Beli Rokok Warkop 1 bungkus', amount: 17000, Icon: BanknoteArrowUp },
      { id: 2, title: 'Uang Keluar', description: 'Beli Nasi 1 Porsi', amount: 20000, Icon: BanknoteArrowUp },
    ],
  },
  {
    id: '2026-02-20',
    dateLabel: "Jum'at, 20 Feb 2026",
    total: 20000,
    items: [{ id: 3, title: 'Uang Keluar', description: 'Beli Nasi 1 Porsi', amount: 20000, Icon: BanknoteArrowUp }],
  },
];

const Pengeluaran: React.FC = () => {
  return (
    <View className='flex-1 pt-3'>
      <ScrollView contentContainerStyle={{ gap: 10, paddingVertical: 12 }}>
        {data.map((group) => (
          <DayGroup
            key={group.id}
            dateLabel={group.dateLabel}
            total={group.total}
            items={group.items as any}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default Pengeluaran;

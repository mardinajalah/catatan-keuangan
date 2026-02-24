import { Cigarette, Utensils } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import DayGroup from './dayGroup';

const data = [
  {
    id: '2026-02-21',
    dateLabel: 'Sabtu, 21 Feb 2026',
    total: 37000,
    items: [
      { id: 1, title: 'Belanja', description: 'Beli Rokok Warkop 1 bungkus', amount: 17000, Icon: Cigarette },
      { id: 2, title: 'Belanja', description: 'Beli Nasi 1 Porsi', amount: 20000, Icon: Utensils },
    ],
  },
  {
    id: '2026-02-20',
    dateLabel: "Jum'at, 20 Feb 2026",
    total: 20000,
    items: [{ id: 3, title: 'Belanja', description: 'Beli Nasi 1 Porsi', amount: 20000, Icon: Utensils }],
  },
];

const Pengeluaran: React.FC = () => {
  return (
    <View style={styles.inner}>
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

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    backgroundColor: '#f6f5fb',
    paddingTop: 12,
  },
});

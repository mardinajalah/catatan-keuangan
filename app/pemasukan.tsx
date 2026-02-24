import { BanknoteArrowDown } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import DayGroup from '@/components/dayGroup';

const data = [
  {
    id: '2026-02-21',
    dateLabel: 'Sabtu, 21 Feb 2026',
    total: 350000,
    items: [{ id: 1, title: 'Uang Masuk', description: 'Kiriman', amount: 17000, Icon: BanknoteArrowDown }],
  },
  {
    id: '2026-02-20',
    dateLabel: "Jum'at, 21 Jan 2026",
    total: 350000,
    items: [{ id: 3, title: 'Uang Masuk', description: 'kiriman', amount: 20000, Icon: BanknoteArrowDown }],
  },
];

const Pemasukan: React.FC = () => {
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

export default Pemasukan;

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    backgroundColor: '#f6f5fb',
    paddingTop: 12,
  },
});

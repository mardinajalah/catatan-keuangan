import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TransactionItem from './transactionItem';

type Item = {
  id: string | number;
  title: string;
  description?: string;
  amount: number | string;
  Icon?: React.ComponentType<any>;
};

type Props = {
  dateLabel: string;
  total?: number | string;
  items: Item[];
};

const formatCurrency = (value: number | string) => {
  const num = typeof value === 'string' ? Number(String(value).replace(/[^0-9]/g, '')) : Number(value);
  if (Number.isNaN(num)) return 'Rp0';
  return 'Rp' + num.toLocaleString('id-ID');
};

const DayGroup: React.FC<Props> = ({ dateLabel, total, items }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>{dateLabel}</Text>
        {typeof total !== 'undefined' ? <Text style={styles.total}>{formatCurrency(total)}</Text> : null}
      </View>

      <View style={styles.card}>
        {items.map((it) => (
          <TransactionItem
            key={it.id}
            title={it.title}
            description={it.description}
            amount={it.amount}
            Icon={it.Icon}
          />
        ))}
      </View>
    </View>
  );
};

export default DayGroup;

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  date: {
    fontSize: 17,
    fontWeight: '700',
    color: '#5409DA',
  },
  total: {
    fontSize: 17,
    fontWeight: '700',
    color: '#5409DA',
  },
  card: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 20,
  },
});

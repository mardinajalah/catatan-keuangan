import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  title: string;
  description?: string;
  amount: number | string;
  Icon?: React.ComponentType<any>;
};

const formatCurrency = (value: number | string) => {
  const num = typeof value === 'string' ? Number(String(value).replace(/[^0-9]/g, '')) : Number(value);
  if (Number.isNaN(num)) return 'Rp0';
  return 'Rp' + num.toLocaleString('id-ID');
};

const TransactionItem: React.FC<Props> = ({ title, description, amount, Icon }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.container}
    >
      <View style={styles.left}>
        <View style={styles.iconWrap}>
          {Icon ? (
            <Icon
              color='#5409DA'
              size={18}
            />
          ) : null}
        </View>
        <View style={styles.texts}>
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.desc}>{description}</Text> : null}
        </View>
      </View>

      <View style={styles.amountWrap}>
        <Text style={styles.amount}>{formatCurrency(amount)}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default TransactionItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    backgroundColor: '#dacfed',
    padding: 10,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    minWidth: 0,
  },
  title: {
    fontWeight: '700',
    color: '#222',
  },
  desc: {
    color: '#666',
    marginTop: 2,
  },
  amountWrap: {
    marginLeft: 8,
  },
  amount: {
    fontWeight: '700',
    color: '#222',
  },
});

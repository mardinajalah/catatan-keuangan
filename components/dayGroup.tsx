import React from 'react';
import { Text, View } from 'react-native';
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
  const num =
    typeof value === 'string'
      ? Number(String(value).replace(/[^0-9]/g, ''))
      : Number(value);

  if (Number.isNaN(num)) return 'Rp0';
  return 'Rp' + num.toLocaleString('id-ID');
};

const DayGroup: React.FC<Props> = ({ dateLabel, total, items }) => {
  return (
    <View className="gap-2">
      
      <View className="flex-row justify-between px-5">
        <Text className="text-[17px] font-bold text-[#5409DA]">
          {dateLabel}
        </Text>

        {typeof total !== 'undefined' && (
          <Text className="text-[17px] font-bold text-[#5409DA]">
            {formatCurrency(total)}
          </Text>
        )}
      </View>

      <View className="bg-white px-5 py-3 rounded-lg mx-5">
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
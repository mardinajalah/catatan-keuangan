import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type Props = {
  title: string;
  description?: string;
  amount: number | string;
  Icon?: React.ComponentType<any>;
};

const formatCurrency = (value: number | string) => {
  const num =
    typeof value === 'string'
      ? Number(String(value).replace(/[^0-9]/g, ''))
      : Number(value);

  if (Number.isNaN(num)) return 'Rp0';
  return 'Rp' + num.toLocaleString('id-ID');
};

const TransactionItem: React.FC<Props> = ({
  title,
  description,
  amount,
  Icon,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="flex-row items-center justify-between py-3"
    >
      <View className="flex-row items-center gap-3">
        
        <View className="bg-[#f6f5fb] p-2.5 rounded-full items-center justify-center">
          {Icon ? <Icon color="#5409DA" size={18} /> : null}
        </View>

        <View className="min-w-0">
          <Text className="font-bold text-[#222]">
            {title}
          </Text>
          {description && (
            <Text className="text-[#666] mt-0.5">
              {description}
            </Text>
          )}
        </View>
      </View>

      <View className="ml-2">
        <Text className="font-bold text-[#222]">
          {formatCurrency(amount)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default TransactionItem;
import { Banknote, CalendarDays, FileText, Tag } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  AppState,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type Props = {
  amountLabel: string;
  namePlaceholder: string;
  categoryPlaceholder: string;
  datePlaceholder: string;
};

const formatAmountInput = (value: string) => {
  const numbersOnly = value.replace(/\D/g, '');

  if (!numbersOnly) {
    return '';
  }

  return Number(numbersOnly).toLocaleString('id-ID');
};

const TransactionForm: React.FC<Props> = ({
  amountLabel,
  namePlaceholder,
  categoryPlaceholder,
  datePlaceholder,
}) => {
  const [scrollKey, setScrollKey] = useState(0);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status) => {
      if (status === 'active') {
        setScrollKey((current) => current + 1);
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <KeyboardAvoidingView
      className='flex-1'
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className='flex-1'>
        <KeyboardAwareScrollView
          key={scrollKey}
          enableOnAndroid
          enableAutomaticScroll
          extraScrollHeight={24}
          nestedScrollEnabled
          onScrollBeginDrag={Keyboard.dismiss}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior='never'
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 24,
          }}
        >
          <View className='bg-white rounded-3xl p-5 shadow-md'>
            <Text className='text-gray-500 mb-2'>{amountLabel}</Text>

            <View className='flex-row items-center'>
              <Text className='text-3xl font-bold text-[#5409DA] mr-2'>Rp</Text>
              <TextInput
                value={formatAmountInput(amount)}
                onChangeText={(value) => setAmount(value.replace(/\D/g, ''))}
                placeholder='0'
                keyboardType='numeric'
                className='flex-1 text-3xl font-bold text-[#5409DA]'
              />
            </View>
          </View>

          <View className='bg-white rounded-3xl p-5 mt-6 shadow-md'>
            <View className='flex-row items-center'>
              <Banknote
                size={22}
                color='#5409DA'
              />
              <View className='flex-1 ml-3'>
                <Text className='text-gray-500 text-xs'>Nama Barang</Text>
                <TextInput
                  placeholder={namePlaceholder}
                  className='text-base font-medium mt-1'
                />
              </View>
            </View>

            <View className='flex-row items-center mt-5'>
              <Tag
                size={22}
                color='#5409DA'
              />
              <View className='flex-1 ml-3'>
                <Text className='text-gray-500 text-xs'>Kategori</Text>
                <TextInput
                  placeholder={categoryPlaceholder}
                  className='text-base font-medium mt-1'
                />
              </View>
            </View>

            <View className='flex-row items-center mt-5'>
              <CalendarDays
                size={22}
                color='#5409DA'
              />
              <View className='flex-1 ml-3'>
                <Text className='text-gray-500 text-xs'>Tanggal</Text>
                <TextInput
                  placeholder={datePlaceholder}
                  className='text-base font-medium mt-1'
                />
              </View>
            </View>

            <View className='flex-row items-start mt-5'>
              <FileText
                size={22}
                color='#5409DA'
              />
              <View className='flex-1 ml-3'>
                <Text className='text-gray-500 text-xs'>Catatan</Text>
                <TextInput
                  placeholder='Tambahkan catatan...'
                  multiline
                  numberOfLines={3}
                  className='text-base font-medium mt-1'
                />
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>

        <View className='px-5 pt-2 pb-5 bg-[#f6f5fb]'>
          <TouchableOpacity
            activeOpacity={0.8}
            className='bg-[#4E71FF] rounded-2xl py-4 items-center'
          >
            <Text className='text-white font-bold text-lg'>Simpan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default TransactionForm;

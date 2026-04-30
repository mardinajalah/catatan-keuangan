import {
  getCurrentDateInput,
  TransactionType,
  useTransactions,
} from '@/components/TransactionsStore';
import { useRouter } from 'expo-router';
import { Banknote, Tag } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
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
  type: TransactionType;
  amountLabel: string;
  namePlaceholder: string;
  categoryPlaceholder: string;
};

const formatAmountInput = (value: string) => {
  const numbersOnly = value.replace(/\D/g, '');

  if (!numbersOnly) {
    return '';
  }

  return Number(numbersOnly).toLocaleString('id-ID');
};

const TransactionForm: React.FC<Props> = ({
  type,
  amountLabel,
  namePlaceholder,
  categoryPlaceholder,
}) => {
  const router = useRouter();
  const { addTransaction } = useTransactions();
  const [scrollKey, setScrollKey] = useState(0);
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status) => {
      if (status === 'active') {
        setScrollKey((current) => current + 1);
      }
    });

    return () => subscription.remove();
  }, []);

  const handleSave = () => {
    const amountValue = Number(amount);

    if (!amountValue) {
      Alert.alert('Nominal belum diisi', 'Masukkan jumlah transaksi terlebih dahulu.');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Nama belum diisi', 'Masukkan nama transaksi terlebih dahulu.');
      return;
    }

    addTransaction({
      type,
      title,
      category: category || 'Lainnya',
      date: getCurrentDateInput(),
      note: '',
      amount: amountValue,
    });

    setAmount('');
    setTitle('');
    setCategory('');
    Keyboard.dismiss();
    router.back();
  };

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
            paddingBottom: 28,
          }}
        >
          <View className='bg-white rounded-lg px-5 py-6'>
            <Text className='text-[#666] mb-2'>{amountLabel}</Text>

            <View className='flex-row items-center'>
              <Text className='text-3xl font-bold text-[#222] mr-2'>Rp</Text>
              <TextInput
                value={formatAmountInput(amount)}
                onChangeText={(value) => setAmount(value.replace(/\D/g, ''))}
                placeholder='0'
                keyboardType='numeric'
                className='flex-1 text-3xl font-bold text-[#222]'
              />
            </View>
          </View>

          <View className='bg-white rounded-lg px-5 py-2 mt-4'>
            <View className='flex-row items-center py-4 border-b border-[#f0eef8]'>
              <Banknote
                size={20}
                color='#666'
              />
              <View className='flex-1 ml-3'>
                <Text className='text-[#666] text-xs'>Nama Transaksi</Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder={namePlaceholder}
                  placeholderTextColor='#999'
                  className='text-base font-medium text-[#222] mt-1'
                />
              </View>
            </View>

            <View className='flex-row items-center py-4'>
              <Tag
                size={20}
                color='#666'
              />
              <View className='flex-1 ml-3'>
                <Text className='text-[#666] text-xs'>Kategori</Text>
                <TextInput
                  value={category}
                  onChangeText={setCategory}
                  placeholder={categoryPlaceholder}
                  placeholderTextColor='#999'
                  className='text-base font-medium text-[#222] mt-1'
                />
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>

        <View className='px-5 pt-2 pb-5 bg-[#f6f5fb]'>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSave}
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

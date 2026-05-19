import {
  getCurrentDateInput,
  TransactionType,
  useTransactions,
} from '@/components/TransactionsStore';
import { normalizeCategory } from '@/utils/category';
import { useRouter } from 'expo-router';
import { Banknote, Tag, CheckCircle, XCircle } from 'lucide-react-native';
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
  Modal,
  ActivityIndicator,
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
  const { addTransaction, expenses, incomes } = useTransactions();
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

  type SaveStatus = 'idle' | 'loading' | 'success' | 'error';
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSave = async () => {
    const amountValue = Number(amount);
    const incomeTotal = incomes.reduce((sum, item) => sum + item.amount, 0);
    const expenseTotal = expenses.reduce((sum, item) => sum + item.amount, 0);
    const currentBalance = incomeTotal - expenseTotal;

    if (!amountValue) {
      setSaveStatus('error');
      setStatusMessage('Masukkan jumlah transaksi terlebih dahulu.');
      return;
    }

    if (!title.trim()) {
      setSaveStatus('error');
      setStatusMessage('Masukkan nama transaksi terlebih dahulu.');
      return;
    }

    if (type === 'expense' && amountValue > currentBalance) {
      setSaveStatus('error');
      setStatusMessage(`Jumlah pengeluaran melebihi saldo saat ini. Saldo tersedia: Rp${currentBalance.toLocaleString('id-ID')}.`);
      return;
    }

    setSaveStatus('loading');
    setStatusMessage('Menyimpan...');

    try {
      await addTransaction({
        type,
        title: title.trim(),
        category: normalizeCategory(category),
        date: getCurrentDateInput(),
        note: '',
        amount: amountValue,
      });

      setAmount('');
      setTitle('');
      setCategory('');
      Keyboard.dismiss();

      setSaveStatus('success');
      setStatusMessage('Data transaksi berhasil disimpan.');
      
      setTimeout(() => {
        setSaveStatus('idle');
        router.back();
      }, 1500);
    } catch (error) {
      setSaveStatus('error');
      setStatusMessage('Gagal menyimpan transaksi. Silakan coba lagi.');
    }
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
            disabled={saveStatus === 'loading'}
            className={`bg-[#4E71FF] rounded-2xl py-4 items-center ${saveStatus === 'loading' ? 'opacity-70' : ''}`}
          >
            <Text className='text-white font-bold text-lg'>
              {saveStatus === 'loading' ? 'Menyimpan...' : 'Simpan'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modal Status */}
        <Modal
          visible={saveStatus !== 'idle'}
          transparent={true}
          animationType="fade"
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white rounded-2xl p-6 items-center w-[80%] max-w-sm shadow-xl">
              {saveStatus === 'loading' && (
                <ActivityIndicator size="large" color="#4E71FF" className="mb-4" />
              )}
              {saveStatus === 'success' && (
                <CheckCircle size={48} color="#10B981" className="mb-4" />
              )}
              {saveStatus === 'error' && (
                <XCircle size={48} color="#EF4444" className="mb-4" />
              )}
              
              <Text className="text-xl font-bold text-[#222] text-center mb-2">
                {saveStatus === 'loading' ? 'Memproses' : saveStatus === 'success' ? 'Berhasil!' : 'Terjadi Kesalahan'}
              </Text>
              
              <Text className="text-base text-[#666] text-center mb-6">
                {statusMessage}
              </Text>

              {saveStatus === 'error' && (
                <TouchableOpacity
                  onPress={() => setSaveStatus('idle')}
                  className="bg-[#EF4444] rounded-xl py-3 px-8 w-full items-center"
                >
                  <Text className="text-white font-bold text-base">Tutup</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

export default TransactionForm;

import {
  getCurrentDateInput,
  TransactionType,
  useTransactions,
} from '@/components/TransactionsStore';
import { normalizeCategory } from '@/utils/category';
import { useRouter } from 'expo-router';
import { Banknote, FileText, Tag } from 'lucide-react-native';
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
import CustomModal from './CustomModal';
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

const formatCurrency = (value: number) => {
  const prefix = value < 0 ? '-Rp' : 'Rp';

  return prefix + Math.abs(value).toLocaleString('id-ID');
};

const TransactionForm: React.FC<Props> = ({
  type,
  amountLabel,
  namePlaceholder,
  categoryPlaceholder,
}) => {
  const router = useRouter();
  const { addTransaction, currentBalance } = useTransactions();
  const [scrollKey, setScrollKey] = useState(0);
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');

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
      setStatusMessage(`Jumlah pengeluaran melebihi saldo saat ini. Saldo tersedia: ${formatCurrency(currentBalance)}.`);
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
        note: note.trim(),
        amount: amountValue,
      });

      setAmount('');
      setTitle('');
      setCategory('');
      setNote('');
      Keyboard.dismiss();

      setSaveStatus('success');
      setStatusMessage('Data transaksi berhasil disimpan.');
      
      setTimeout(() => {
        setSaveStatus('idle');
        router.back();
      }, 1500);
    } catch {
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

            <View className='flex-row items-center py-4 border-b border-[#f0eef8]'>
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

            <View className='flex-row items-start py-4'>
              <FileText
                size={20}
                color='#666'
                className='mt-1'
              />
              <View className='flex-1 ml-3'>
                <Text className='text-[#666] text-xs'>Deskripsi (opsional)</Text>
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder='Contoh: Catatan tambahan transaksi'
                  placeholderTextColor='#999'
                  multiline
                  textAlignVertical='top'
                  className='text-base font-medium text-[#222] mt-1 min-h-20'
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
        <CustomModal
          visible={saveStatus !== 'idle'}
          type={saveStatus === 'loading' ? 'loading' : saveStatus === 'success' ? 'success' : saveStatus === 'error' ? 'error' : 'info'}
          title={saveStatus === 'loading' ? 'Memproses' : saveStatus === 'success' ? 'Berhasil!' : 'Terjadi Kesalahan'}
          message={statusMessage}
          primaryButtonText={saveStatus === 'error' ? 'Tutup' : undefined}
          onPrimaryPress={saveStatus === 'error' ? () => setSaveStatus('idle') : undefined}
          primaryButtonVariant="danger"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default TransactionForm;

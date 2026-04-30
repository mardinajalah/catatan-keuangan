import { Banknote, CalendarDays, FileText, Tag } from 'lucide-react-native';
import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

type Props = {
  amountLabel: string;
  namePlaceholder: string;
  categoryPlaceholder: string;
  datePlaceholder: string;
};

const TransactionForm: React.FC<Props> = ({
  amountLabel,
  namePlaceholder,
  categoryPlaceholder,
  datePlaceholder,
}) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        className='flex-1'
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className='flex-1'>
          <ScrollView
            contentContainerStyle={{
              padding: 20,
              paddingBottom: 24,
            }}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
          >
            <View className='bg-white rounded-3xl p-5 shadow-md'>
              <Text className='text-gray-500 mb-2'>{amountLabel}</Text>

              <View className='flex-row items-center'>
                <Text className='text-3xl font-bold text-[#5409DA] mr-2'>Rp</Text>
                <TextInput
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
          </ScrollView>

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
    </TouchableWithoutFeedback>
  );
};

export default TransactionForm;

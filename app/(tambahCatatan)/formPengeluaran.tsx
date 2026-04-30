import { Banknote, CalendarDays, FileText, Tag } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const FormPengeluaran = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className='flex-1'>
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          extraScrollHeight={80}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 200,
          }}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          {/* NOMINAL */}
          <View className='bg-white rounded-3xl p-5 shadow-md'>
            <Text className='text-gray-500 mb-2'>Jumlah Pengeluaran</Text>

            <View className='flex-row items-center'>
              <Text className='text-3xl font-bold text-[#5409DA] mr-2'>Rp</Text>
              <TextInput
                placeholder='0'
                keyboardType='numeric'
                className='flex-1 text-3xl font-bold text-[#5409DA]'
              />
            </View>
          </View>

          {/* DETAIL */}
          <View className='bg-white rounded-3xl p-5 mt-6 shadow-md'>
            <View className='flex-row items-center'>
              <Banknote
                size={22}
                color='#5409DA'
              />
              <View className='flex-1 ml-3'>
                <Text className='text-gray-500 text-xs'>Nama Barang</Text>
                <TextInput
                  placeholder='Contoh: Makan Siang'
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
                  placeholder='Contoh: Makanan'
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
                  placeholder='20 Juni 2026'
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

          {/* BUTTON */}
          <View
            style={{
              position: 'absolute',
              left: 20,
              right: 20,
              bottom: keyboardHeight > 0 ? keyboardHeight + 10 : 20
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              className='bg-[#4E71FF] rounded-2xl py-4 items-center'
            >
              <Text className='text-white font-bold text-lg'>Simpan</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default FormPengeluaran;

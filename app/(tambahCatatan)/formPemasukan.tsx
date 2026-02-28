import { CalendarDays, FileText, Tag, Wallet } from 'lucide-react-native';
import React, { useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';

const FormPemasukan = () => {
  const scrollRef = useRef<ScrollView>(null);

  const scrollToInput = (y: number) => {
    scrollRef.current?.scrollTo({ y, animated: true });
  };

  return (
    <KeyboardAvoidingView
      className='flex-1'
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className='flex-1'>
          {/* ===== SCROLL AREA ===== */}
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={{ padding: 20, paddingBottom: 140 }}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
          >
            {/* NOMINAL */}
            <View className='bg-white rounded-3xl p-5 shadow-md'>
              <Text className='text-gray-500 mb-2'>Jumlah Pemasukan</Text>

              <View className='flex-row items-center'>
                <Text className='text-3xl font-bold text-[#5409DA] mr-2'>Rp</Text>
                <TextInput
                  placeholder='0'
                  keyboardType='numeric'
                  className='flex-1 text-3xl font-bold text-[#5409DA]'
                  onFocus={() => scrollToInput(0)}
                />
              </View>
            </View>

            {/* DETAIL CARD */}
            <View className='bg-white rounded-3xl p-5 mt-6 shadow-md'>
              {/* Sumber */}
              <View className='flex-row items-center'>
                <Wallet
                  size={22}
                  color='#5409DA'
                />
                <View className='flex-1 ml-3'>
                  <Text className='text-gray-500 text-xs'>Sumber Pemasukan</Text>
                  <TextInput
                    placeholder='Contoh: Gaji Bulanan'
                    className='text-base font-medium mt-1'
                    onFocus={() => scrollToInput(150)}
                  />
                </View>
              </View>

              {/* Kategori */}
              <View className='flex-row items-center mt-5'>
                <Tag
                  size={22}
                  color='#5409DA'
                />
                <View className='flex-1 ml-3'>
                  <Text className='text-gray-500 text-xs'>Kategori</Text>
                  <TextInput
                    placeholder='Contoh: Gaji / Bonus'
                    className='text-base font-medium mt-1'
                    onFocus={() => scrollToInput(250)}
                  />
                </View>
              </View>

              {/* Tanggal */}
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
                    onFocus={() => scrollToInput(350)}
                  />
                </View>
              </View>

              {/* Catatan */}
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
                    onFocus={() => scrollToInput(450)}
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          {/* ===== FIXED BUTTON ===== */}
          <View className='absolute bottom-5 left-5 right-5'>
            <TouchableOpacity
              activeOpacity={0.8}
              className='bg-[#4E71FF] rounded-2xl py-4 items-center'
              style={{
                shadowColor: '#4E71FF',
                shadowOpacity: 0.4,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 4 },
                elevation: 4,
              }}
            >
              <Text className='text-white font-bold text-lg'>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default FormPemasukan;

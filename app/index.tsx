import Laporan from '@/app/laporan';
import Pemasukan from '@/app/pemasukan';
import Pengeluaran from '@/app/pengeluaran';
import { Plus } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const TABS = ['Pengeluaran', 'Pemasukan', 'Laporan'];

export default function Index() {
  const [active, setActive] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const btnLayouts = useRef<Array<{ x: number; width: number }>>([]);
  const measuredCount = useRef(0);
  const [measured, setMeasured] = useState(false);
  const indicatorLeft = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;
  const startTranslate = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        translateX.stopAnimation((val: number) => {
          startTranslate.current = val;
        });
      },
      onPanResponderMove: (_, gestureState) => {
        const next = startTranslate.current + gestureState.dx;
        const leftBound = -((TABS.length - 1) * width);
        const clamped = Math.max(Math.min(next, 0), leftBound);
        translateX.setValue(clamped);
      },
      onPanResponderRelease: (_, gestureState) => {
        const next = startTranslate.current + gestureState.dx;
        const rawIndex = -next / width;
        const index = Math.round(Math.max(Math.min(rawIndex, TABS.length - 1), 0));
        setActive(index);
        Animated.spring(translateX, { toValue: -index * width, useNativeDriver: false }).start();
      },
    }),
  ).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: -active * width,
      useNativeDriver: false,
    }).start();
  }, [active]);

  return (
    <SafeAreaView className='flex-1 bg-[#4E71FF]'>
      {/* HEADER */}
      <View className='pb-2.5 px-4'>
        <Text className='text-white text-xl font-bold text-center mt-5'>Catatan Keuangan</Text>
        <View className='flex-row justify-between mt-8 bg-[#405ed3] rounded-full'>
          {/* INDICATOR */}
          {measured ? (
            <Animated.View
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                borderRadius: 999,
                backgroundColor: '#fff',
                width: translateX.interpolate({
                  inputRange: TABS.map((_, i) => -i * width).reverse(),
                  outputRange: btnLayouts.current.map((l) => l.width).reverse(),
                  extrapolate: 'clamp',
                }),
                transform: [
                  {
                    translateX: translateX.interpolate({
                      inputRange: TABS.map((_, i) => -i * width).reverse(),
                      outputRange: btnLayouts.current.map((l) => l.x).reverse(),
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              }}
            />
          ) : (
            <Animated.View
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                borderRadius: 999,
                backgroundColor: '#fff',
                width: indicatorWidth,
                transform: [{ translateX: indicatorLeft }],
              }}
            />
          )}

          {TABS.map((label, idx) => (
            <TouchableOpacity
              key={label}
              onLayout={(e) => {
                const { x, width: w } = e.nativeEvent.layout;
                if (!btnLayouts.current[idx]) measuredCount.current += 1;
                btnLayouts.current[idx] = { x, width: w };
                if (measuredCount.current === TABS.length && !measured) {
                  setMeasured(true);
                }
              }}
              className='py-2.5 px-4 rounded-full'
              activeOpacity={1}
              onPress={() => setActive(idx)}
            >
              <Text className={`font-semibold ${active === idx ? 'text-[#5409DA]' : 'text-white'}`}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* CONTENT */}
      <View className='flex-1 bg-[#f6f5fb]'>
        <Animated.View
          {...panResponder.panHandlers}
          className='flex-row flex-1'
          style={{
            width: width * TABS.length,
            transform: [{ translateX }],
          }}
        >
          <View
            style={{ width }}
            className='flex-1'
          >
            <Pengeluaran />
          </View>
          <View
            style={{ width }}
            className='flex-1'
          >
            <Pemasukan />
          </View>
          <View
            style={{ width }}
            className='flex-1'
          >
            <Laporan />
          </View>
        </Animated.View>
      </View>

      {/* FLOATING BUTTON */}
      {(active === 0 || active === 1) && (
        <View className='absolute bottom-8 right-5 bg-[#4E71FF] w-14 h-14 rounded-full items-center justify-center'>
          <Plus
            color='#f6f5fb'
            size={28}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

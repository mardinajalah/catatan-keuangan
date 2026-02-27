import { ChevronLeft, Plus } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface TabItem {
  label: string;
  content: React.ReactNode;
}

interface Props {
  title: string;
  tabs: TabItem[];
  initialActiveTab?: number;
  showBackButton?: boolean;
  onFabPress?: (activeIndex: number) => void;
  onBackPress?: () => void;
}

export default function MainContainer({ title, tabs, onFabPress, showBackButton = false, onBackPress, initialActiveTab = 0 }: Props) {
  const [active, setActive] = useState(initialActiveTab ?? 0);
  const translateX = useRef(new Animated.Value(0)).current;
  const startX = useRef(0);

  useEffect(() => {
    setActive(initialActiveTab ?? 0);

    // pastikan translateX ikut pindah
    translateX.setValue(-(initialActiveTab ?? 0) * width);
    startX.current = -(initialActiveTab ?? 0) * width;
  }, [initialActiveTab]);

  // PAN RESPONDER (FIXED)
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 5,

      onPanResponderGrant: () => {
        translateX.stopAnimation((value) => {
          startX.current = value;
        });
      },

      onPanResponderMove: (_, gesture) => {
        const next = startX.current + gesture.dx;

        const leftBound = -(tabs.length - 1) * width;
        const clamped = Math.max(Math.min(next, 0), leftBound);

        translateX.setValue(clamped);
      },

      onPanResponderRelease: (_, gesture) => {
        const movedX = startX.current + gesture.dx;
        const rawIndex = -movedX / width;
        const newIndex = Math.round(rawIndex);

        const clampedIndex = Math.max(0, Math.min(newIndex, tabs.length - 1));

        setActive(clampedIndex);

        Animated.spring(translateX, {
          toValue: -clampedIndex * width,
          useNativeDriver: false,
        }).start();
      },
    }),
  ).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: -active * width,
      useNativeDriver: false,
    }).start();
  }, [active]);

  // ===== INDICATOR ANIMATION (FIXED) =====
  const inputRange = tabs.map((_, i) => -i * width).reverse();

  const outputRange = tabs.map((_, i) => i * (width / tabs.length)).reverse();

  const indicatorTranslate = translateX.interpolate({
    inputRange,
    outputRange,
    extrapolate: 'clamp',
  });

  const indicatorWidth = width / tabs.length;

  // Tab labels and measurement state for animated indicator
  const TABS = tabs.map((t) => t.label);
  const [measured, setMeasured] = useState(false);
  const btnLayouts = useRef<{ x: number; width: number }[]>([]);
  const measuredCount = useRef(0);

  // indicatorLeft — fallback to animated interpolation when buttons not measured
  const indicatorLeft = indicatorTranslate;

  // Activate tab helper to keep translateX and startX in sync
  const activateTab = (idx: number) => {
    // ensure any running animation is stopped and startX reflects final position
    translateX.stopAnimation(() => {
      startX.current = -idx * width;
      setActive(idx);

      Animated.spring(translateX, {
        toValue: -idx * width,
        useNativeDriver: false,
      }).start();
    });
  };

  return (
    <SafeAreaView className='flex-1 bg-[#4E71FF]'>
      {/* HEADER */}
      <View className='pb-2.5 px-4'>
        <View className='flex-row items-center justify-between mt-5'>
          {/* BACK BUTTON */}
          {showBackButton ? (
            <TouchableOpacity
              onPress={onBackPress}
              className='w-10 h-10 items-center justify-center'
              activeOpacity={0.7}
            >
              <ChevronLeft
                size={26}
                color='white'
              />
            </TouchableOpacity>
          ) : (
            <View className='w-10' />
          )}

          {/* TITLE */}
          <Text className='text-white text-xl font-bold'>{title}</Text>

          {/* Spacer supaya title tetap center */}
          <View className='w-10' />
        </View>

        {/* TAB SECTION */}
        {tabs.length > 0 && (
          <View className='mt-8 bg-[#405ed3] rounded-full overflow-hidden'>
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

            {/* TABS */}
            <View className='flex-row'>
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
                  className='flex-1 py-3 items-center'
                  activeOpacity={0.8}
                  onPress={() => activateTab(idx)}
                >
                  <Text className={`font-semibold ${active === idx ? 'text-[#5409DA]' : 'text-white'}`}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* CONTENT */}
      <View className='flex-1 bg-[#f6f5fb]'>
        <Animated.View
          {...panResponder.panHandlers}
          className='flex-row flex-1'
          style={{
            width: width * tabs.length,
            transform: [{ translateX }],
          }}
        >
          {tabs.map((tab, idx) => (
            <View
              key={idx}
              style={{ width }}
              className='flex-1'
            >
              {tab.content}
            </View>
          ))}
        </Animated.View>
      </View>

      {/* FLOATING BUTTON */}
      {(active === 0 || active === 1) && !showBackButton && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onFabPress?.(active)}
          className='absolute bottom-8 right-5 bg-[#4E71FF] w-14 h-14 rounded-full items-center justify-center'
          style={{
            elevation: 5, // android shadow
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 3 },
          }}
        >
          <Plus
            color='#f6f5fb'
            size={28}
          />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

import Laporan from '@/components/laporan';
import Pemasukan from '@/components/pemasukan';
import Pengeluaran from '@/components/pengeluaran';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  }, [active, translateX]);

  const moveIndicatorTo = (index: number, animated = true) => {
    const layout = btnLayouts.current[index];
    if (!layout) return;
    if (!animated) {
      indicatorLeft.setValue(layout.x);
      indicatorWidth.setValue(layout.width);
      return;
    }
    Animated.parallel([Animated.timing(indicatorLeft, { toValue: layout.x, duration: 220, useNativeDriver: false }), Animated.timing(indicatorWidth, { toValue: layout.width, duration: 220, useNativeDriver: false })]).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContent}>
        <Text style={styles.textHeader}>Catatan Keuangan</Text>

        <View style={styles.buttonsHeader}>
          {measured ? (
            <Animated.View
              style={[
                styles.indicator,
                {
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
                },
              ]}
            />
          ) : (
            <Animated.View style={[styles.indicator, { width: indicatorWidth, transform: [{ translateX: indicatorLeft }] }]} />
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
                  moveIndicatorTo(active, false);
                }
              }}
              style={styles.itemButtonHeader}
              activeOpacity={1}
              onPress={() => {
                setActive(idx);
                moveIndicatorTo(idx, true);
              }}
            >
              <Text style={[styles.textButtonHeader, active === idx && styles.textButtonActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.content}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[styles.slider, { width: width * TABS.length, transform: [{ translateX }] }]}
        >
          <View style={[styles.page, { width }]}>
            <Pengeluaran />
          </View>
          <View style={[styles.page, { width }]}>
            <Pemasukan />
          </View>
          <View style={[styles.page, { width }]}>
            <Laporan />
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4E71FF',
  },
  headerContent: {
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  textHeader: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  buttonsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    backgroundColor: '#405ed3',
    borderRadius: 50,
  },
  itemButtonHeader: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 18,
    paddingRight: 18,
    borderRadius: 50,
  },
  itemButtonActive: {
    backgroundColor: '#fff',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  textButtonHeader: {
    color: '#fff',
    fontWeight: '600',
  },
  textButtonActive: {
    color: '#5409DA',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slider: {
    flexDirection: 'row',
    flex: 1,
  },
  page: {
    flex: 1,
  },
});

import React from 'react';
import { View } from 'react-native';

type SkeletonBlockProps = {
  className?: string;
};

export const SkeletonBlock: React.FC<SkeletonBlockProps> = ({ className = '' }) => (
  <View className={`bg-[#ece9f6] ${className}`} />
);

const TransactionSkeletonCard = () => (
  <View className="gap-2">
    <View className="flex-row justify-between px-5">
      <SkeletonBlock className="h-5 w-32 rounded-full" />
      <SkeletonBlock className="h-5 w-24 rounded-full" />
    </View>

    <View className="bg-white px-5 py-4 rounded-lg mx-5 gap-4">
      {[0, 1, 2].map((item) => (
        <View key={item} className="flex-row items-center justify-between gap-4">
          <View className="flex-1 gap-2">
            <SkeletonBlock className="h-4 w-3/4 rounded-full" />
            <SkeletonBlock className="h-3 w-1/2 rounded-full" />
          </View>
          <SkeletonBlock className="h-4 w-20 rounded-full" />
        </View>
      ))}
    </View>
  </View>
);

export const TransactionListSkeleton = () => (
  <View className="flex-1 pt-3">
    <View className="gap-4 py-12">
      <TransactionSkeletonCard />
      <TransactionSkeletonCard />
    </View>
  </View>
);

export const LaporanSkeleton = () => (
  <View className="flex-1 pt-3">
    <View className="gap-3 px-5 py-12">
      <View className="bg-white rounded-lg p-4 gap-3">
        <View className="flex-row items-center justify-between">
          <SkeletonBlock className="h-5 w-36 rounded-full" />
          <SkeletonBlock className="h-8 w-16 rounded-full" />
        </View>
        <View className="flex-row flex-wrap gap-2">
          <SkeletonBlock className="h-9 w-24 rounded-full" />
          <SkeletonBlock className="h-9 w-24 rounded-full" />
          <SkeletonBlock className="h-9 w-24 rounded-full" />
        </View>
      </View>

      <View className="bg-[#4E71FF] rounded-lg p-5 gap-4">
        <SkeletonBlock className="h-4 w-32 rounded-full bg-white/30" />
        <SkeletonBlock className="h-9 w-44 rounded-full bg-white/30" />
        <SkeletonBlock className="h-3 w-52 rounded-full bg-white/30" />
        <View className="flex-row gap-3">
          <SkeletonBlock className="h-16 flex-1 rounded-lg bg-white/20" />
          <SkeletonBlock className="h-16 flex-1 rounded-lg bg-white/20" />
        </View>
      </View>

      <View className="bg-white rounded-lg p-4 gap-4">
        <View className="flex-row justify-between">
          <SkeletonBlock className="h-5 w-28 rounded-full" />
          <SkeletonBlock className="h-4 w-16 rounded-full" />
        </View>
        <View className="flex-row items-end justify-between h-24">
          {[0, 1, 2, 3].map((item) => (
            <View key={item} className="items-center flex-1 gap-2">
              <View className="h-16 flex-row items-end gap-1">
                <SkeletonBlock className="w-3 h-10 rounded-full" />
                <SkeletonBlock className="w-3 h-14 rounded-full" />
              </View>
              <SkeletonBlock className="h-3 w-10 rounded-full" />
            </View>
          ))}
        </View>
      </View>

      <View className="bg-white rounded-lg p-4 gap-4">
        <View className="flex-row justify-between">
          <SkeletonBlock className="h-5 w-28 rounded-full" />
          <SkeletonBlock className="h-4 w-20 rounded-full" />
        </View>
        {[0, 1, 2].map((item) => (
          <View key={item} className="gap-2">
            <View className="flex-row justify-between">
              <SkeletonBlock className="h-4 w-24 rounded-full" />
              <SkeletonBlock className="h-4 w-20 rounded-full" />
            </View>
            <SkeletonBlock className="h-3 w-full rounded-full" />
          </View>
        ))}
      </View>
    </View>
  </View>
);

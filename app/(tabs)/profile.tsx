import { User } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#4E71FF]">
      {/* HEADER */}
      <View className="py-5 px-4 items-center border-b border-[#405ed3]">
        <Text className="text-white text-xl font-bold">Profile</Text>
      </View>

      {/* CONTENT */}
      <View className="flex-1 bg-[#f6f5fb] items-center justify-center px-6">
        <View className="w-24 h-24 rounded-full bg-[#4E71FF]/10 items-center justify-center mb-4">
          <User size={48} color="#4E71FF" />
        </View>
        <Text className="text-[#222] font-bold text-lg text-center">Profil Pengguna</Text>
        <Text className="text-[#666] text-sm text-center mt-2 px-8">
          Halaman profil sedang dalam tahap pengembangan awal.
        </Text>
      </View>
    </SafeAreaView>
  );
}

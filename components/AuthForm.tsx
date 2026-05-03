import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Mail, Lock, User } from 'lucide-react-native';

interface AuthFormProps {
  type: 'login' | 'register';
  isLoading?: boolean;
  errorMessage?: string | null;
  onSubmit: (data: any) => void;
  onFooterLinkPress: () => void;
}

export default function AuthForm({ type, isLoading = false, errorMessage = null, onSubmit, onFooterLinkPress }: AuthFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const isLogin = type === 'login';
  
  const handleSubmit = () => {
    onSubmit({ name: !isLogin ? name : undefined, email, password });
  };
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 justify-center bg-[#f6f5fb] px-6"
    >
      <View className="mb-10 mt-12">
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          {isLogin ? 'Selamat Datang Kembali 👋' : 'Buat Akun Baru ✨'}
        </Text>
        <Text className="text-base text-gray-500">
          {isLogin 
            ? 'Silakan masuk untuk melanjutkan.' 
            : 'Daftar sekarang untuk mencatat keuanganmu dengan mudah.'}
        </Text>
      </View>
      
      <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        {!isLogin && (
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Nama Lengkap</Text>
            <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
              <User size={20} color="#9ca3af" style={{ marginRight: 12 }} />
              <TextInput 
                className="flex-1 text-base text-gray-900"
                placeholder="Masukkan nama Anda"
                placeholderTextColor="#9ca3af"
                value={name}
                onChangeText={setName}
                editable={!isLoading}
              />
            </View>
          </View>
        )}
        
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
          <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
            <Mail size={20} color="#9ca3af" style={{ marginRight: 12 }} />
            <TextInput 
              className="flex-1 text-base text-gray-900"
              placeholder="contoh@email.com"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
            />
          </View>
        </View>
        
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
          <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
            <Lock size={20} color="#9ca3af" style={{ marginRight: 12 }} />
            <TextInput 
              className="flex-1 text-base text-gray-900"
              placeholder="Masukkan password Anda"
              placeholderTextColor="#9ca3af"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
            />
          </View>
        </View>
        
        {errorMessage && (
          <Text className="text-red-500 text-sm mb-4 text-center">{errorMessage}</Text>
        )}
        
        {isLogin && (
          <TouchableOpacity className="mb-6 items-end" disabled={isLoading}>
            <Text className="text-sm font-medium text-[#4E71FF]">Lupa Password?</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          className="bg-[#4E71FF] rounded-xl py-4 items-center shadow-sm flex-row justify-center"
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" style={{ marginRight: 8 }} />
          ) : null}
          <Text className="text-white font-bold text-lg">
            {isLoading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar Sekarang')}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View className="flex-row justify-center mt-8">
        <Text className="text-gray-500 text-base">
          {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
        </Text>
        <TouchableOpacity onPress={onFooterLinkPress} disabled={isLoading}>
          <Text className="text-[#4E71FF] font-bold text-base">
            {isLogin ? 'Daftar' : 'Masuk'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

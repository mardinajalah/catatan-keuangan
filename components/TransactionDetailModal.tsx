import React from 'react';
import { Modal, View, Text, TouchableOpacity, Pressable, ScrollView, StyleSheet } from 'react-native';
import { X, Calendar, Tag, Banknote, FileText } from 'lucide-react-native';
import { Transaction, formatDateLabel } from './TransactionsStore';

interface TransactionDetailModalProps {
  visible: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  visible,
  transaction,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!transaction) return null;

  const formattedAmount = `Rp${transaction.amount.toLocaleString('id-ID')}`;
  const transactionTypeLabel = transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran';
  const amountColor = transaction.type === 'income' ? 'text-[#10B981]' : 'text-[#EF4444]';

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Tutup detail transaksi"
        />

        <View
          className="bg-white rounded-3xl p-6 w-[85%] max-w-md shadow-2xl relative"
          style={styles.card}
        >
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-50 active:bg-gray-100 z-10"
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Tutup detail transaksi"
          >
            <X size={18} color="#666" />
          </TouchableOpacity>

          <Text className="text-xl font-bold text-[#222] mb-5 pr-8">
            Detail Transaksi
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View className="items-center mb-6 py-4 bg-gray-50 rounded-2xl">
              <Text className="text-xs font-semibold text-[#666] uppercase tracking-wider">
                {transactionTypeLabel}
              </Text>
              <Text className={`text-2xl font-black mt-1 ${amountColor}`}>
                {formattedAmount}
              </Text>
            </View>

            <View className="gap-y-4">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-3">
                  <Banknote size={16} color="#666" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-gray-400">Judul Transaksi</Text>
                  <Text className="text-base font-semibold text-[#222]" numberOfLines={1}>{transaction.title}</Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-3">
                  <Tag size={16} color="#666" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-gray-400">Kategori</Text>
                  <Text className="text-base font-medium text-[#222]" numberOfLines={1}>{transaction.category}</Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-3">
                  <Calendar size={16} color="#666" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-gray-400">Tanggal</Text>
                  <Text className="text-base font-medium text-[#222]">{formatDateLabel(transaction.date)}</Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-3 mt-0.5">
                  <FileText size={16} color="#666" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-gray-400">Catatan</Text>
                  <Text className="text-base text-[#666] mt-0.5 leading-relaxed">
                    {transaction.note ? transaction.note : 'Tidak ada deskripsi'}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          <View className="flex-row gap-3 mt-6">
            <TouchableOpacity
              onPress={() => onDelete(transaction)}
              className="flex-1 rounded-xl py-3.5 items-center bg-[#EF4444] active:bg-[#DC2626]"
              activeOpacity={0.8}
            >
              <Text className="font-bold text-base text-white">Hapus</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onEdit(transaction)}
              className="flex-1 rounded-xl py-3.5 items-center bg-[#4E71FF] active:bg-[#3B59E0]"
              activeOpacity={0.8}
            >
              <Text className="font-bold text-base text-white">Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  card: {
    maxHeight: '82%',
  },
  scrollContent: {
    paddingBottom: 2,
  },
});

export default TransactionDetailModal;

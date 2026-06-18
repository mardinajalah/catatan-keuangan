import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { X, Calendar, Tag, Banknote, FileText } from 'lucide-react-native';
import { Transaction, formatDateLabel } from './TransactionsStore';

type TransactionEditData = {
  type: Transaction['type'];
  title: string;
  category: string;
  date: string;
  note: string;
  amount: number;
};

interface TransactionDetailModalProps {
  visible: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onEdit: (transaction: Transaction, updatedData: TransactionEditData) => Promise<void>;
  onDelete: (transaction: Transaction) => Promise<void>;
}

const formatCurrency = (value: number) => `Rp${value.toLocaleString('id-ID')}`;

const isValidDateInput = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  return !Number.isNaN(new Date(`${value}T00:00:00`).getTime());
};

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  visible,
  transaction,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (!transaction) return;

    setTitle(transaction.title);
    setCategory(transaction.category);
    setAmount(String(transaction.amount));
    setNote(transaction.note || '');
    setDate(transaction.date);
  }, [transaction, visible]);

  useEffect(() => {
    if (!visible) {
      setIsEditing(false);
      setIsLoading(false);
    }
  }, [visible]);

  const handleClose = () => {
    if (isLoading) return;

    setIsEditing(false);
    onClose();
  };

  const handleSave = async () => {
    if (!transaction) return;

    const parsedAmount = Number(amount);
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      Alert.alert('Validasi', 'Judul transaksi wajib diisi.');
      return;
    }

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Validasi', 'Nominal transaksi harus berupa angka lebih dari 0.');
      return;
    }

    if (!isValidDateInput(date.trim())) {
      Alert.alert('Validasi', 'Format tanggal harus valid (YYYY-MM-DD).');
      return;
    }

    setIsLoading(true);
    try {
      await onEdit(transaction, {
        type: transaction.type,
        title: trimmedTitle,
        amount: parsedAmount,
        category: category.trim(),
        note: note.trim(),
        date: date.trim(),
      });
      setIsEditing(false);
      onClose();
    } catch {
      Alert.alert('Error', 'Gagal memperbarui transaksi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (!transaction || isLoading) return;

    Alert.alert(
      'Konfirmasi Hapus',
      'Apakah Anda yakin ingin menghapus transaksi ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await onDelete(transaction);
              onClose();
            } catch {
              Alert.alert('Error', 'Gagal menghapus transaksi.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
    );
  };

  const renderDetailContent = () => {
    if (!transaction) {
      return <ActivityIndicator size="large" color="#4E71FF" />;
    }

    const transactionTypeLabel = transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran';
    const amountColor = transaction.type === 'income' ? 'text-[#10B981]' : 'text-[#EF4444]';

    return (
      <>
        <View className="items-center mb-6 py-4 bg-gray-50 rounded-2xl">
          <Text className="text-xs font-semibold text-[#666] uppercase tracking-wider">
            {transactionTypeLabel}
          </Text>
          <Text className={`text-2xl font-black mt-1 ${amountColor}`}>
            {formatCurrency(transaction.amount)}
          </Text>
        </View>

        <View className="gap-y-4">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-3">
              <Banknote size={16} color="#666" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-400">Judul Transaksi</Text>
              <Text className="text-base font-semibold text-[#222]" numberOfLines={1}>
                {transaction.title}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-3">
              <Tag size={16} color="#666" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-400">Kategori</Text>
              <Text className="text-base font-medium text-[#222]" numberOfLines={1}>
                {transaction.category}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-3">
              <Calendar size={16} color="#666" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-400">Tanggal</Text>
              <Text className="text-base font-medium text-[#222]">
                {formatDateLabel(transaction.date)}
              </Text>
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
      </>
    );
  };

  const renderEditContent = () => (
    <View className="gap-y-3">
      <View>
        <Text className="text-xs text-gray-400 font-semibold mb-1">Judul Transaksi</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Judul"
          editable={!isLoading}
          className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-base text-gray-800 bg-gray-50"
        />
      </View>

      <View>
        <Text className="text-xs text-gray-400 font-semibold mb-1">Nominal (Rp)</Text>
        <TextInput
          value={Number(amount || 0) > 0 ? Number(amount).toLocaleString('id-ID') : amount}
          onChangeText={(value) => setAmount(value.replace(/\D/g, ''))}
          placeholder="Nominal"
          keyboardType="numeric"
          editable={!isLoading}
          className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-base text-gray-800 bg-gray-50 font-bold"
        />
      </View>

      <View>
        <Text className="text-xs text-gray-400 font-semibold mb-1">Kategori</Text>
        <TextInput
          value={category}
          onChangeText={setCategory}
          placeholder="Kategori"
          editable={!isLoading}
          className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-base text-gray-800 bg-gray-50"
        />
      </View>

      <View>
        <Text className="text-xs text-gray-400 font-semibold mb-1">Tanggal (YYYY-MM-DD)</Text>
        <TextInput
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          editable={!isLoading}
          className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-base text-gray-800 bg-gray-50"
        />
      </View>

      <View>
        <Text className="text-xs text-gray-400 font-semibold mb-1">Catatan</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Catatan opsional"
          multiline
          editable={!isLoading}
          textAlignVertical="top"
          className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-base text-gray-800 bg-gray-50 min-h-[72px]"
        />
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleClose}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel="Tutup detail transaksi"
        />

        <View className="bg-white rounded-3xl p-6 w-[85%] max-w-md shadow-2xl relative" style={styles.card}>
          {!isLoading && (
            <TouchableOpacity
              onPress={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-50 active:bg-gray-100 z-10"
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Tutup detail transaksi"
            >
              <X size={18} color="#666" />
            </TouchableOpacity>
          )}

          <Text className="text-xl font-bold text-[#222] mb-5 pr-8">
            {isEditing ? 'Edit Transaksi' : 'Detail Transaksi'}
          </Text>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {isEditing ? renderEditContent() : renderDetailContent()}
          </ScrollView>

          {isEditing ? (
            <View className="flex-row gap-3 mt-6">
              <TouchableOpacity
                onPress={() => setIsEditing(false)}
                disabled={isLoading}
                className="flex-1 rounded-xl py-3.5 items-center bg-gray-200 active:bg-gray-300"
                activeOpacity={0.8}
              >
                <Text className="font-bold text-base text-gray-700">Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                disabled={isLoading}
                className="flex-1 rounded-xl py-3.5 items-center bg-[#4E71FF] active:bg-[#3B59E0]"
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="font-bold text-base text-white">Simpan</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-row gap-3 mt-6">
              <TouchableOpacity
                onPress={handleDelete}
                disabled={!transaction || isLoading}
                className="flex-1 rounded-xl py-3.5 items-center bg-[#EF4444] active:bg-[#DC2626]"
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="font-bold text-base text-white">Hapus</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                disabled={!transaction || isLoading}
                className="flex-1 rounded-xl py-3.5 items-center bg-[#4E71FF] active:bg-[#3B59E0]"
                activeOpacity={0.8}
              >
                <Text className="font-bold text-base text-white">Edit</Text>
              </TouchableOpacity>
            </View>
          )}
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
    maxHeight: '84%',
  },
  scrollContent: {
    paddingBottom: 2,
  },
});

export default TransactionDetailModal;

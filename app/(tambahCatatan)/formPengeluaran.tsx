import TransactionForm from '@/components/TransactionForm';

const FormPengeluaran = () => {
  return (
    <TransactionForm
      amountLabel='Jumlah Pengeluaran'
      namePlaceholder='Contoh: Makan Siang'
      categoryPlaceholder='Contoh: Makanan'
      datePlaceholder='20 Juni 2026'
    />
  );
};

export default FormPengeluaran;

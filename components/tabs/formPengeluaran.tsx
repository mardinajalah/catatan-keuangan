import TransactionForm from '@/components/TransactionForm';

const FormPengeluaran = () => {
  return (
    <TransactionForm
      type='expense'
      amountLabel='Jumlah Pengeluaran'
      namePlaceholder='Contoh: Makan Siang'
      categoryPlaceholder='Contoh: Makanan'
    />
  );
};

export default FormPengeluaran;

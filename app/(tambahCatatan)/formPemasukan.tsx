import TransactionForm from '@/components/TransactionForm';

const FormPemasukan = () => {
  return (
    <TransactionForm
      amountLabel='Jumlah Pemasukan'
      namePlaceholder='Contoh: Gaji Bulanan'
      categoryPlaceholder='Contoh: Gaji'
      datePlaceholder='20 Juni 2026'
    />
  );
};

export default FormPemasukan;

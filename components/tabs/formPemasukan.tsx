import TransactionForm from '@/components/TransactionForm';

const FormPemasukan = () => {
  return (
    <TransactionForm
      type='income'
      amountLabel='Jumlah Pemasukan'
      namePlaceholder='Contoh: Gaji Bulanan'
      categoryPlaceholder='Contoh: Gaji'
    />
  );
};

export default FormPemasukan;

import { StyleSheet, Text, View } from 'react-native';

const Pengeluaran = () => (
  <View style={styles.inner}>
    <Text style={styles.title}>Pengeluaran</Text>
    <Text>Daftar pengeluaran akan tampil di sini.</Text>
  </View>
);

export default Pengeluaran;

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
});

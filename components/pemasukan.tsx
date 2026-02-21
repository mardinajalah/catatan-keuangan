import { StyleSheet, Text, View } from 'react-native';

const Pemasukan = () => (
  <View style={styles.inner}>
    <Text style={styles.title}>Pemasukan</Text>
    <Text>Daftar pemasukan akan tampil di sini.</Text>
  </View>
);

export default Pemasukan;

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

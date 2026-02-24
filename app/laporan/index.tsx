import { StyleSheet, Text, View } from 'react-native';

const Laporan = () => (
  <View style={styles.inner}>
    <Text style={styles.title}>Laporan</Text>
    <Text>Laporan ringkasan keuangan akan tampil di sini.</Text>
  </View>
);

export default Laporan;

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

import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerContent}>
          <Text style={styles.textHeader}>Catatan Keuangan</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4E71FF',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContent: {
    backgroundColor: '#4E71FF',
    padding: 20,
    height: 100,
  },
  textHeader: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

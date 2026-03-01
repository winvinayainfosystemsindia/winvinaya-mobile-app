import { StyleSheet } from 'react-native';
import { Button, Text as PaperText } from 'react-native-paper';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useAppStore } from '@/store/useAppStore';

export default function TabOneScreen() {
  const { count, increment, decrement } = useAppStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <View style={styles.counterContainer}>
        <PaperText style={{ fontSize: 24, fontWeight: 'bold' }}>Count: {count}</PaperText>
        <View style={styles.buttonRow}>
          <Button mode="contained" onPress={increment} style={styles.button}>
            Increment
          </Button>
          <Button mode="outlined" onPress={decrement} style={styles.button}>
            Decrement
          </Button>
        </View>
      </View>

      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  counterContainer: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  button: {
    minWidth: 120,
  },
});

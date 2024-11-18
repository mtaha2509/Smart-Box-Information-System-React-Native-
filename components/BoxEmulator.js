import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import SmartBoxEmulator from '../classes/SmartBoxEmulatorClass';

const BoxEmulator = () => {
  const [small, setSmall] = useState('');
  const [medium, setMedium] = useState('');
  const [large, setLarge] = useState('');
  const [status, setStatus] = useState([]);
  const [emulator, setEmulator] = useState(null);

  const initializeEmulator = () => {
    const smallCount = parseInt(small) || 0;
    const mediumCount = parseInt(medium) || 0;
    const largeCount = parseInt(large) || 0;

    const newEmulator = new SmartBoxEmulator(smallCount, mediumCount, largeCount);
    setEmulator(newEmulator);
    setStatus(newEmulator.getStatus());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Box Emulator Setup</Text>

      <TextInput
        style={styles.input}
        placeholder="Number of Small Compartments"
        keyboardType="numeric"
        value={small}
        onChangeText={setSmall}
      />
      <TextInput
        style={styles.input}
        placeholder="Number of Medium Compartments"
        keyboardType="numeric"
        value={medium}
        onChangeText={setMedium}
      />
      <TextInput
        style={styles.input}
        placeholder="Number of Large Compartments"
        keyboardType="numeric"
        value={large}
        onChangeText={setLarge}
      />

      <Button title="Initialize Emulator" onPress={initializeEmulator} />

      {status.length > 0 && (
        <View style={styles.statusContainer}>
          <Text style={styles.subtitle}>Compartment Status:</Text>
          <FlatList
            data={status}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Text style={styles.statusItem}>
                {item.id} - Size: {item.size}, Locked: {item.locked ? 'Yes' : 'No'}, Occupied: {item.occupied ? 'Yes' : 'No'}
              </Text>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5, borderColor: '#ced4da' },
  statusContainer: { marginTop: 20 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  statusItem: { fontSize: 16, paddingVertical: 5 },
});

export default BoxEmulator;

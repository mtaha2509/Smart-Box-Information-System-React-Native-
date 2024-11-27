import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from 'react-native';
import SmartBoxEmulator from '../classes/SmartBoxEmulatorClass';

const BoxEmulator = () => {
  const [small, setSmall] = useState('');
  const [medium, setMedium] = useState('');
  const [large, setLarge] = useState('');
  const [status, setStatus] = useState([]);
  const [emulator, setEmulator] = useState(null);
  const [adminOTP, setAdminOTP] = useState('');
  const [userOTP, setUserOTP] = useState('');

  // Initialize Emulator
  const initializeEmulator = () => {
    try {
      if (!small || !medium || !large) {
        throw new Error('Please enter values for all compartment sizes.');
      }
      
      const smallCount = parseInt(small) || 0;
      const mediumCount = parseInt(medium) || 0;
      const largeCount = parseInt(large) || 0;

      const newEmulator = new SmartBoxEmulator(smallCount, mediumCount, largeCount);
      setEmulator(newEmulator);
      setStatus(newEmulator.getStatus());
      Alert.alert('Success', 'Emulator initialized successfully.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Handle OTP Matching
  const verifyOTP = () => {
    if (!adminOTP || !userOTP) {
      Alert.alert('Error', 'Please enter both Admin and User OTPs.');
      return;
    }

    if (adminOTP !== userOTP) {
      // Log or report the issue
      console.error('OTP Mismatch: Admin OTP does not match User OTP.');
      Alert.alert('Error', 'OTP mismatch detected. Please try again.');
    } else {
      Alert.alert('Success', 'OTP verified successfully.');
    }
  };

  // Monitor and Alert for System Events
  const monitorSystem = () => {
    if (!emulator) {
      Alert.alert('Error', 'Emulator not initialized. Please initialize first.');
      return;
    }

    const lockedCompartments = status.filter(compartment => compartment.locked);
    if (lockedCompartments.length === 0) {
      Alert.alert('Monitoring Alert', 'All compartments are unlocked. Ensure proper security.');
    }

    const occupiedCompartments = status.filter(compartment => compartment.occupied);
    if (occupiedCompartments.length === 0) {
      Alert.alert('Monitoring Alert', 'No compartments are occupied. Ensure proper usage.');
    }
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

      <View style={styles.otpContainer}>
        <TextInput
          style={styles.input}
          placeholder="Admin OTP"
          keyboardType="numeric"
          value={adminOTP}
          onChangeText={setAdminOTP}
        />
        <TextInput
          style={styles.input}
          placeholder="User OTP"
          keyboardType="numeric"
          value={userOTP}
          onChangeText={setUserOTP}
        />
        <Button title="Verify OTP" onPress={verifyOTP} />
      </View>

      <Button title="Monitor System" onPress={monitorSystem} />

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
  otpContainer: { marginVertical: 20 },
  statusContainer: { marginTop: 20 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  statusItem: { fontSize: 16, paddingVertical: 5 },
});

export default BoxEmulator;

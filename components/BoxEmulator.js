import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Alert,
  ScrollView,
} from 'react-native';
import SmartBoxEmulator from '../classes/SmartBoxEmulatorClass';
import axios from 'axios';

const BoxEmulator = () => {
  const [small, setSmall] = useState('');
  const [medium, setMedium] = useState('');
  const [large, setLarge] = useState('');
  const [status, setStatus] = useState([]);
  const [riderOTP, setRiderOTP] = useState('');
  const [userOTP, setUserOTP] = useState('');
  const [doorOpen, setDoorOpen] = useState(false);
  const [logMessages, setLogMessages] = useState([]);
  const [emulator, setEmulator] = useState(null);

  const addLog = (message) => {
    setLogMessages((prevLogs) => [...prevLogs, message]);
  };

  // Initialize Emulator
  const initializeEmulator = async () => {
    try {
      if (!small || !medium || !large) {
        throw new Error('Please enter values for all compartment sizes.');
      }

      const smallCount = parseInt(small) || 0;
      const mediumCount = parseInt(medium) || 0;
      const largeCount = parseInt(large) || 0;

      if (smallCount === 0 && mediumCount === 0 && largeCount === 0) {
        throw new Error('Compartment sizes cannot all be zero.');
      }

      const newEmulator = new SmartBoxEmulator(smallCount, mediumCount, largeCount);
      setEmulator(newEmulator);
      setStatus(newEmulator.getStatus());

      addLog('Emulator initialized successfully.');
      Alert.alert('Success', 'Emulator initialized successfully.');
    } catch (error) {
      console.error('Initialization Error:', error.message);
      addLog(`Error: ${error.message}`);
      Alert.alert('Error', error.message);
    }
  };

  // Fetch OTPs from APIs
  const fetchOTPs = async () => {
    try {
      const riderResponse = await axios.get('https://api.module3.com/otp/rider');
      const userResponse = await axios.get('https://api.module1.com/otp/user');

      setRiderOTP(riderResponse.data.otp);
      setUserOTP(userResponse.data.otp);

      addLog('OTPs fetched successfully.');
      Alert.alert('Success', 'OTPs fetched successfully.');
    } catch (error) {
      console.error('Fetch OTPs Error:', error.message);
      addLog(`Error: Failed to fetch OTPs - ${error.message}`);
      Alert.alert('Error', 'Failed to fetch OTPs.');
    }
  };

  // Compare OTPs and Grant Access
  const grantAccess = () => {
    try {
      if (!riderOTP || !userOTP) {
        throw new Error('OTPs are not available. Fetch them first.');
      }

      if (riderOTP !== userOTP) {
        throw new Error('OTP mismatch detected.');
      }

      addLog('Access granted. Door will close in 5 seconds.');
      Alert.alert('Success', 'Access Granted. Door will close in 5 seconds.');

      setDoorOpen(true);

      // Start timer to close the door after 5 seconds
      setTimeout(() => {
        setDoorOpen(false);
        addLog('Door closed automatically.');
        Alert.alert('Door Closed', 'The door has been automatically closed.');
      }, 5000);
    } catch (error) {
      console.error('Grant Access Error:', error.message);
      addLog(`Error: ${error.message}`);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
        <Button title="Fetch OTPs" onPress={fetchOTPs} />
        <Button title="Grant Access" onPress={grantAccess} />
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.subtitle}>Compartment Status:</Text>
        <FlatList
          data={status}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text style={styles.statusItem}>
              {item.id} - Size: {item.size}, Locked: {item.locked ? 'Yes' : 'No'},{' '}
              Occupied: {item.occupied ? 'Yes' : 'No'}
            </Text>
          )}
        />
      </View>

      <View style={styles.logContainer}>
        <Text style={styles.subtitle}>Logs:</Text>
        <FlatList
          data={logMessages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <Text style={styles.logItem}>{item}</Text>}
        />
      </View>

      <Text style={styles.doorStatus}>
        Door Status: {doorOpen ? 'Open' : 'Closed'}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5, borderColor: '#ced4da' },
  otpContainer: { marginVertical: 20 },
  statusContainer: { marginVertical: 20 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  statusItem: { fontSize: 16, paddingVertical: 5 },
  logContainer: { marginVertical: 20 },
  logItem: { fontSize: 14, color: '#6c757d', marginBottom: 5 },
  doorStatus: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 20 },
});

export default BoxEmulator;

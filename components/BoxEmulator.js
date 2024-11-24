import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';
import SmartBoxEmulator from '../classes/SmartBoxEmulatorClass';

const BoxEmulator = () => {
  const [small, setSmall] = useState('');
  const [medium, setMedium] = useState('');
  const [large, setLarge] = useState('');
  const [status, setStatus] = useState([]);
  const [emulator, setEmulator] = useState(null);
  const [adminOTP, setAdminOTP] = useState('1234'); // Default to hardcoded value
  const [userOTP, setUserOTP] = useState('1234');  // Default to hardcoded value
  const [eventLog, setEventLog] = useState([]);

  const [scheduleVerified, setScheduleVerified] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [verificationDisplayed, setVerificationDisplayed] = useState(false);

  const scheduledTime = '2023-10-10T15:00:00Z'; // Hardcoded schedule as an ISO string

  const initializeEmulator = () => {
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
      setEventLog([]); // Reset logs on re-initialization
      setVerificationDisplayed(false); // Reset display on re-initialization
      Alert.alert('Success', 'Emulator initialized successfully.');
    } catch (error) {
      console.error('Initialization Error:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  const isScheduleCorrect = () => {
    const now = new Date('2023-10-10T15:00:00Z');
    const scheduledDate = new Date(scheduledTime);
    return now >= scheduledDate;
  };

  const verifyOTPAndSchedule = () => {
    try {
      if (!adminOTP || !userOTP) {
        throw new Error('Please enter both Admin and User OTPs.');
      }

      let scheduleCorrect = isScheduleCorrect();
      if (!scheduleCorrect) {
        throw new Error('Attempt to access before the scheduled time.');
      }

      if (adminOTP !== userOTP) {
        throw new Error('OTP mismatch detected.');
      }

      setScheduleVerified(scheduleCorrect);
      setOtpVerified(true);
      setVerificationDisplayed(true);

      if (scheduleCorrect && adminOTP === userOTP) {
        updateCompartmentStatus(true); // Open the compartment
        logEvent("Access granted, compartment opened.");
      }
    } catch (error) {
      console.error('Verification Error:', error.message);
      Alert.alert('Error', error.message);
      logEvent(error.message); // Log the error event
    }
  };

  const updateCompartmentStatus = (isOpen) => {
    if (emulator) {
      emulator.updateStatus(isOpen ? 'open' : 'closed');
      setStatus(emulator.getStatus());
      logEvent(`Compartment status updated to ${isOpen ? 'open' : 'closed'}.`);
    }
  };

  const lockCompartment = () => {
    updateCompartmentStatus(false); // Lock the compartment
    logEvent("Compartment locked manually.");
  };

  const logEvent = (eventDescription) => {
    setEventLog(prevLogs => [...prevLogs, `${new Date().toLocaleTimeString()}: ${eventDescription}`]);
  };

  return (
     <ScrollView style={styles.container}>
      
     
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
      <Button title="Verify Access" onPress={verifyOTPAndSchedule} color="green" />
      <Button title="Lock Compartment" onPress={lockCompartment} color="red" />

      {verificationDisplayed && (
        <View>
          <Text style={styles.statusItem}>Scheduled Time: {new Date(scheduledTime).toLocaleString()}</Text>
          <Text style={styles.statusItem}>Schedule Verified: {scheduleVerified ? 'Yes' : 'No'}</Text>
          <Text style={styles.statusItem}>Admin OTP: {adminOTP}</Text>
          <Text style={styles.statusItem}>User OTP: {userOTP}</Text>
          <Text style={styles.statusItem}>OTP Verified: {otpVerified ? 'Yes' : 'No'}</Text>
        </View>
      )}

      {status.length > 0 && (
        <View style={styles.statusContainer}>
          <Text style={styles.subtitle}>Compartment Status:</Text>
          <FlatList
            data={status}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Text style={styles.statusItem}>
                {item.id} - Size: {item.size}, Locked: {item.locked ? 'Yes' : 'No'}, Occupied: {item.occupied ? 'Yes' : 'No'}
              </Text>
            )}
          />
        </View>
      )}

      <View style={styles.logContainer}>
        <Text style={styles.subtitle}>Event Log:</Text>
        <FlatList
          data={eventLog}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <Text style={styles.logItem}>{item}</Text>}
        />
      </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5, borderColor: '#ced4da' },
  statusContainer: { marginTop: 20 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  statusItem: { fontSize: 16, paddingVertical: 5, marginBottom: 5 },
  logContainer: { marginTop: 20 },
  logItem: { fontSize: 14, paddingVertical: 2 },
});

export default BoxEmulator;

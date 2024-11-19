import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from 'react-native';
import SmartBoxEmulator from '../classes/SmartBoxEmulatorClass';

const BoxEmulator = () => {
  const [small, setSmall] = useState('');
  const [medium, setMedium] = useState('');
  const [large, setLarge] = useState('');
  const [status, setStatus] = useState([]);
  const [emulator, setEmulator] = useState(null);

  // Hardcoded OTPs and Schedule
  const adminOTP = '1234'; // Hardcoded admin OTP
  const userOTP = '1234';  // Hardcoded user OTP
  const scheduledTime = '2023-10-10T15:00:00Z'; // Hardcoded schedule as an ISO string

  const [scheduleVerified, setScheduleVerified] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [verificationDisplayed, setVerificationDisplayed] = useState(false);

  const initializeEmulator = () => {
    const smallCount = parseInt(small) || 0;
    const mediumCount = parseInt(medium) || 0;
    const largeCount = parseInt(large) || 0;

    const newEmulator = new SmartBoxEmulator(smallCount, mediumCount, largeCount);
    setEmulator(newEmulator);
    setStatus(newEmulator.getStatus());
    setVerificationDisplayed(false); // Reset display on re-initialization
  };

  const isScheduleCorrect = () => {
    const now = new Date(); // Get the current date and time
    const scheduledDate = new Date(scheduledTime); // Convert scheduled time to a Date object
    return now >= scheduledDate; // Check if current time is on or past the scheduled time
  };

  const verifyOTPAndSchedule = () => {
    let scheduleCorrect = isScheduleCorrect();
    let otpMatch = adminOTP === userOTP;
    setScheduleVerified(scheduleCorrect);
    setOtpVerified(otpMatch);
    setVerificationDisplayed(true); // Display verification results only after this function is called

    if (scheduleCorrect && otpMatch) {
      Alert.alert("Access Granted", "The compartment will now open.");
      updateCompartmentStatus(true); // This should trigger the compartment to open
    } else {
      let errorMessage = !scheduleCorrect ? "Schedule not met." : "OTP mismatch.";
      Alert.alert("Access Denied", errorMessage);
    }
  };

  const updateCompartmentStatus = (isOpen) => {
    if (emulator) {
      emulator.updateStatus(isOpen ? 'open' : 'closed');
      setStatus(emulator.getStatus());
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
      <Button title="Verify Access" onPress={verifyOTPAndSchedule} color="green" />

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5, borderColor: '#ced4da' },
  statusContainer: { marginTop: 20 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  statusItem: { fontSize: 16, paddingVertical: 5, marginBottom: 5 },
});

export default BoxEmulator;

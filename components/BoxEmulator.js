import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert, ScrollView, TouchableOpacity } from 'react-native';
import SmartParcelBoxEmulator from '../classes/SmartBoxEmulatorClass';
import axios from 'axios'; // Make sure to install axios first

const BoxEmulator = () => {
  const [emulator, setEmulator] = useState(null);
  const [selectedCompartment, setSelectedCompartment] = useState(null);
  const [adminOTP, setAdminOTP] = useState('');
  const [userOTP, setUserOTP] = useState('');
  const [eventLog, setEventLog] = useState([]);
  const [doorOpen, setDoorOpen] = useState(false);

  // Fetch OTPs from APIs
  const fetchOTPs = async () => {
    try {
      const riderResponse = await axios.get('https://api.module3.com/otp/rider');
      const userResponse = await axios.get('https://api.module1.com/otp/user');

      setAdminOTP(riderResponse.data.otp);
      setUserOTP(userResponse.data.otp);

      logEvent('OTPs fetched successfully');
      Alert.alert('Success', 'OTPs fetched successfully.');
    } catch (error) {
      console.error('Fetch OTPs Error:', error.message);
      logEvent(`Error: Failed to fetch OTPs - ${error.message}`);
      Alert.alert('Error', 'Failed to fetch OTPs.');
    }
  };

  const initializeEmulator = () => {
    try {
      const newEmulator = new SmartParcelBoxEmulator();
      setEmulator(newEmulator);
      setEventLog(newEmulator.getLogs());
      Alert.alert('Success', 'Emulator initialized with 12 Smart Parcel Boxes across 3 locations.');
    } catch (error) {
      console.error('Initialization Error:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  const verifyOTPAndAccess = () => {
    if (!emulator || !selectedCompartment) {
      Alert.alert('Error', 'Please initialize emulator and select a compartment first.');
      return;
    }

    try {
      const result = emulator.verifyOTP(selectedCompartment.id, adminOTP, userOTP);
      
      if (result.success) {
        setSelectedCompartment(result.compartment);
        setEventLog(emulator.getLogs());
        
        // Open door and set auto-close
        setDoorOpen(true);
        logEvent('Door opened');
        
        setTimeout(() => {
          setDoorOpen(false);
          logEvent('Door closed automatically');
          Alert.alert('Door Closed', 'The door has been automatically closed.');
        }, 5000);

        Alert.alert('Success', result.message);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Verification Error:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  const toggleOccupation = () => {
    if (!emulator || !selectedCompartment) {
      Alert.alert('Error', 'Please select a compartment first.');
      return;
    }

    const result = emulator.setOccupationStatus(
      selectedCompartment.id, 
      !selectedCompartment.occupied
    );

    if (result.success) {
      setSelectedCompartment(emulator.findCompartment(selectedCompartment.id));
      setEventLog(emulator.getLogs());
    }
  };

  const fetchUnoccupiedBox = async () => {
  if (!emulator) {
    Alert.alert('Error', 'Please initialize the emulator first.');
    return;
  }

  try {
    // Fetch location and size parameters from Module 3 API
    const response = await axios.get('https://api.module3.com/request-box');
    const { location, size } = response.data;

    logEvent(`Fetching unoccupied box for Location: ${location}, Size: ${size}`);

    // Find unoccupied box
    const unoccupiedBox = emulator.locations
      .find((loc) => loc.id === location)
      ?.compartments.find((comp) => !comp.occupied && comp.size === size);

    if (unoccupiedBox) {
      // Return box ID to Module 3 API
      await axios.post('https://api.module3.com/return-box', { boxId: unoccupiedBox.id });
      logEvent(`Unoccupied box found: ${unoccupiedBox.id}`);
      Alert.alert('Success', `Unoccupied box found: ${unoccupiedBox.id}`);
    } else {
      logEvent('No unoccupied box found for the given parameters');
      Alert.alert('Error', 'No unoccupied box found for the given parameters.');
      }
  } catch (error) {
    console.error('Fetch Unoccupied Box Error:', error.message);
    logEvent(`Error: Failed to fetch unoccupied box - ${error.message}`);
    Alert.alert('Error', 'Failed to fetch unoccupied box.');
    }
  };

  const lockCompartment = () => {
    if (!emulator || !selectedCompartment) {
      Alert.alert('Error', 'Please select a compartment first.');
      return;
    }

    const result = emulator.toggleLock(selectedCompartment.id, true);
    
    if (result.success) {
      setSelectedCompartment(emulator.findCompartment(selectedCompartment.id));
      setEventLog(emulator.getLogs());
    }
  };

  const logEvent = (message) => {
    const newLog = { timestamp: new Date().toISOString(), event: message };
    setEventLog(prevLogs => [newLog, ...prevLogs]);
  };

  const renderCompartmentList = () => {
    if (!emulator) return null;

    return (
      <ScrollView horizontal>
        {emulator.locations.map(location => (
          <View key={location.id} style={styles.locationContainer}>
            <Text style={styles.locationTitle}>{location.id}</Text>
            <FlatList
              data={location.compartments}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.compartmentItem, 
                    { 
                      backgroundColor: item.color,
                      borderWidth: selectedCompartment?.id === item.id ? 2 : 0,
                      borderColor: 'red'
                    }
                  ]}
                  onPress={() => setSelectedCompartment(item)}
                >
                  <Text style={styles.compartmentText}>
                    {item.id} - {item.size}
                    {'\n'}Locked: {item.locked ? 'Yes' : 'No'}
                    {'\n'}Occupied: {item.occupied ? 'Yes' : 'No'}
                  </Text>
                </TouchableOpacity>
              )}
              numColumns={3}
            />
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Smart Parcel Box Emulator</Text>

      <Button title="Initialize Emulator" onPress={initializeEmulator} />
      <Button title="Fetch OTPs" onPress={fetchOTPs} />

      {emulator && (
        <>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Admin OTP"
              value={adminOTP}
              onChangeText={setAdminOTP}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="User OTP"
              value={userOTP}
              onChangeText={setUserOTP}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Verify OTP" onPress={verifyOTPAndAccess} color="green" />
            <Button title="Toggle Occupation" onPress={toggleOccupation} color="blue" />
            <Button title="Lock Compartment" onPress={lockCompartment} color="red" />
          </View>

          <Text style={[styles.doorStatus, { color: doorOpen ? 'green' : 'red' }]}>
            Door Status: {doorOpen ? 'Open' : 'Closed'}
          </Text>

          {selectedCompartment && (
            <View style={styles.selectedCompartmentContainer}>
              <Text style={styles.subtitle}>Selected Compartment Details:</Text>
              <Text>ID: {selectedCompartment.id}</Text>
              <Text>Size: {selectedCompartment.size}</Text>
              <Text>Status: {selectedCompartment.locked ? 'Locked' : 'Unlocked'}</Text>
              <Text>Occupation: {selectedCompartment.occupied ? 'Occupied' : 'Vacant'}</Text>
            </View>
          )}

          {renderCompartmentList()}

          <View style={styles.logContainer}>
            <Text style={styles.subtitle}>Event Log:</Text>
            <FlatList
              data={eventLog.slice().reverse()}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Text style={styles.logItem}>
                  [{new Date(item.timestamp).toLocaleString()}] {item.event}
                </Text>
              )}
            />
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f8f9fa' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10
  },
  input: { 
    borderWidth: 1, 
    padding: 10, 
    width: '48%', 
    borderRadius: 5, 
    borderColor: '#ced4da' 
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10
  },
  locationContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#e9ecef',
    borderRadius: 5
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  compartmentItem: {
    margin: 5,
    padding: 10,
    borderRadius: 5,
    width: 100,
    alignItems: 'center'
  },
  compartmentText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold'
  },
  selectedCompartmentContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#e9ecef',
    borderRadius: 5
  },
  subtitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  logContainer: { 
    marginTop: 20 
  },
  logItem: { 
    fontSize: 14, 
    paddingVertical: 2,
    backgroundColor: '#f1f3f5',
    marginBottom: 5,
    padding: 5,
    borderRadius: 3
  },
  doorStatus: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginTop: 20 
  },
});

export default BoxEmulator;
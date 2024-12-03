import React, { useState } from "react";
import { StyleSheet, TextInput, View, Button, Alert } from "react-native";
import { SERVER_URL } from '../env';

const EnterOTP = ({ route, navigation }) => {
  const [enteredOtp, setEnteredOtp] = useState("");
  const { otp, boxId } = route.params; // OTP from the previous screen

  const handleValidateOtp = () => {
    console.log(enteredOtp, otp)
    if (enteredOtp == otp) {
      // Prepare the payload for the API call
      const payload = {
          boxId: boxId, // Ensure `boxId` is defined and available in your scope
      };
  
      // Make the API call
      fetch(`${SERVER_URL}/api/users/setboxreceived`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
      })
          .then((response) => response.json())
          .then((data) => {
              if (data.message === 'Order not found with the given Box ID') {
                  // Handle case when box ID is not found
                  console.error('Box ID not found:', data.message);
                  Alert.alert("Error", "Box ID not found");
              } else {
                  // Successful API response
                  console.log('Box received updated:', data);
                  // Navigate to the success page after updating the backend
                  navigation.navigate("Success");
              }
          })
          .catch((error) => {
              console.error('Error updating box received status:', error);
              Alert.alert("Error", "Failed to update box received status. Please try again.");
          });
  
    } else {
      Alert.alert("Error", "Invalid OTP, please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={enteredOtp}
        onChangeText={setEnteredOtp}
        keyboardType="numeric"
      />
      <Button title="Validate OTP" onPress={handleValidateOtp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default EnterOTP;

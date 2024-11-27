import React, { useState } from "react";
import { StyleSheet, TextInput, View, Button, Alert } from "react-native";

const EnterOTP = ({ route, navigation }) => {
  const [enteredOtp, setEnteredOtp] = useState("");
  const { otp } = route.params; // OTP from the previous screen

  const handleValidateOtp = () => {
    console.log(enteredOtp, otp)
    if (enteredOtp == otp) {
      // OTP is valid, navigate to the success page
      navigation.navigate("Success");
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

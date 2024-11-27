import React, { useState } from "react";
import { StyleSheet, View, Button, Alert } from "react-native";

const GenerateOTP = ({ navigation }) => {
  const [otp, setOtp] = useState(null); // Store OTP

  const handleGenerateOtp = async () => {
    try {
      const response = await fetch("http://172.20.10.4:3000/generate-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerId: "CUST67890" }), // Example customerId
      });

      if (response.ok) {
        const data = await response.json();
        setOtp(data.otp); // Save OTP
        // Notify user (you can use a library like react-native-push-notification for real notifications)
        Alert.alert("OTP Generated", `Your OTP is: ${data.otp}`);
        
        // Navigate to EnterOTP screen
        navigation.navigate("EnterOTP", { otp: data.otp });
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Failed to generate OTP");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to connect to the server");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Request a Rider" onPress={handleGenerateOtp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GenerateOTP;

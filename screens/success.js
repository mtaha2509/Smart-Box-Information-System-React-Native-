import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Success = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.successText}>Your Rider is on its way!!!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  successText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "green",
  },
});

export default Success;

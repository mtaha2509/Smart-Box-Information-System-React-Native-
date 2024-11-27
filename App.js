import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/loginpage';  // Adjust the import path as needed
import Signup from './screens/signuppage';  // Adjust the import path as needed
import { StatusBar } from 'expo-status-bar';
import GenerateOTP from './screens/getOTP';
import Success from './screens/success';
import EnterOTP from './screens/enterOTP';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name='getOTP' component={GenerateOTP} />
        <Stack.Screen name="EnterOTP" component={EnterOTP} />
        <Stack.Screen name="Success" component={Success} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


import { View, Text, Image, Pressable, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import Button from '../components/Button';
import COLORS from '../utils/signlogincolors';
import { Picker } from '@react-native-picker/picker';  // Import Picker
import { SERVER_URL } from '../env';

const Login = ({ navigation }) => {
    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const [isChecked, setIsChecked] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState('user'); // Default to 'user'

    // Handle login based on role
    const handleLogin = async () => {
        let loginUrl = '';
        let loginData = {};

        // Prepare data and URL based on selected role
        if (role === 'user') {
            loginUrl = `${SERVER_URL}/api/auth/userlogin`;
            loginData = { email, password };
        } else if (role === 'admin') {
            loginUrl = `${SERVER_URL}/api/auth/adminlogin`;
            loginData = { email, password };
        } else if (role === 'rider') {
            loginUrl = `${SERVER_URL}/api/auth/riderlogin`;
            loginData = { phoneNumber, password };
        }

        try {
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (data.message === "Login successful") {
                const userId = data.user.id
                // On successful login, navigate to the next page
                navigation.navigate('myOrders', { userId });  // Adjust the target screen name as needed
            } else {
                // Show error if login fails
                Alert.alert("Error", data.message || "Login failed. Please try again.");
            }
        } catch (error) {
            // Handle any network errors
            Alert.alert("Error", "An error occurred. Please try again later.");
            console.error(error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ flex: 1, marginHorizontal: 22 }}>
                <View style={{ marginVertical: 22 }}>
                    <Text style={{
                        fontSize: 22,
                        fontWeight: 'bold',
                        marginVertical: 12,
                        color: COLORS.black
                    }}>
                        Hi Welcome Back ! 👋
                    </Text>

                    <Text style={{
                        fontSize: 16,
                        color: COLORS.black
                    }}>Parcel delivered, efficiently!</Text>
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Role</Text>

                    <Picker
                        selectedValue={role}
                        onValueChange={(itemValue) => setRole(itemValue)}
                        style={{
                            width: '100%',
                            height: 70,
                            borderColor: COLORS.black,
                            borderWidth: 1,
                            borderRadius: 8,
                        }}
                    >
                        <Picker.Item label="User" value="user" />
                        <Picker.Item label="Admin" value="admin" />
                        <Picker.Item label="Rider" value="rider" />
                    </Picker>
                </View>

                {/* Conditional Inputs Based on Role */}
                {role === 'user' || role === 'admin' ? (
                    <>
                        <View style={{ marginBottom: 12 }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: 400,
                                marginVertical: 8
                            }}>Email address</Text>

                            <View style={{
                                width: "100%",
                                height: 48,
                                borderColor: COLORS.black,
                                borderWidth: 1,
                                borderRadius: 8,
                                alignItems: "center",
                                justifyContent: "center",
                                paddingLeft: 22
                            }}>
                                <TextInput
                                    placeholder='Enter your email address'
                                    placeholderTextColor={COLORS.black}
                                    keyboardType='email-address'
                                    style={{
                                        width: "100%"
                                    }}
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                        </View>
                    </>
                ) : null}

                {role === 'rider' ? (
                    <View style={{ marginBottom: 12 }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8
                        }}>Phone Number</Text>

                        <View style={{
                            width: "100%",
                            height: 48,
                            borderColor: COLORS.black,
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: "center",
                            justifyContent: "center",
                            paddingLeft: 22
                        }}>
                            <TextInput
                                placeholder='Enter your phone number'
                                placeholderTextColor={COLORS.black}
                                keyboardType='phone-pad'
                                style={{
                                    width: "100%"
                                }}
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                            />
                        </View>
                    </View>
                ) : null}

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Password</Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            placeholder='Enter your password'
                            placeholderTextColor={COLORS.black}
                            secureTextEntry={isPasswordShown}
                            style={{
                                width: "100%"
                            }}
                            value={password}
                            onChangeText={setPassword}
                        />

                        <TouchableOpacity
                            onPress={() => setIsPasswordShown(!isPasswordShown)}
                            style={{
                                position: "absolute",
                                right: 12
                            }}
                        >
                            {
                                isPasswordShown == true ? (
                                    <Ionicons name="eye-off" size={24} color={COLORS.black} />
                                ) : (
                                    <Ionicons name="eye" size={24} color={COLORS.black} />
                                )
                            }
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{
                    flexDirection: 'row',
                    marginVertical: 6
                }}>
                    <Checkbox
                        style={{ marginRight: 8 }}
                        value={isChecked}
                        onValueChange={setIsChecked}
                        color={isChecked ? COLORS.primary : undefined}
                    />

                    <Text>Remember Me</Text> {/* handle later */}
                </View>

                <Button
                    title="Login"
                    filled
                    style={{
                        marginTop: 18,
                        marginBottom: 4,
                    }}
                    onPress={handleLogin}
                />

                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginVertical: 22
                }}>
                    <Text style={{ fontSize: 16, color: COLORS.black }}>Don't have an account ? </Text>
                    <Pressable
                        onPress={() => {
                            navigation.navigate('Signup');  // Navigate to SignUp page
                        }}
                    >
                        <Text style={{
                            fontSize: 16,
                            color: '#084abd',
                            fontWeight: "bold",
                            marginLeft: 6
                        }}>Register</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default Login;

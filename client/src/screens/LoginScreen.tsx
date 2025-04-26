// app/login.tsx → imports this screen

import React from 'react';
import { View, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import LoginForm from '../components/auth/LoginForm';
import { loginStyles } from '../styles/styles';

const LoginScreen: React.FC = () => {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.replace('/home'); // Navigate to Home after successful login
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={loginStyles.container}>
        <Text style={loginStyles.title}>Welcome Back</Text>

        {/* Login Form */}
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;

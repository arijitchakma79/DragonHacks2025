//src/screens/SignInScreen.tsx

import React from 'react';
import { View, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import SignInForm from '../components/auth/SignInForm';
import { loginStyles } from '../styles/styles';

const SignInScreen = () => {
  const router = useRouter();

  const handleSignInSuccess = () => {
    router.replace('/home');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={loginStyles.container}>
        <Text style={loginStyles.title}>Sign Up</Text>
        <SignInForm onSignInSuccess={handleSignInSuccess} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignInScreen;
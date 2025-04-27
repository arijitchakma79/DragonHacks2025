//src/components/auth/SignInForm.tsx 

import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { formStyles, colors } from '../../styles/styles';

const SignInForm = ({ onSignInSuccess }: { onSignInSuccess: () => void }) => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('All fields are required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignIn = () => {
    setError('');
    if (validateForm()) {
      onSignInSuccess();
    }
  };

  return (
    <View style={formStyles.container}>
      {/* Error Message */}
      {error ? <Text style={formStyles.errorText}>{error}</Text> : null}

      {/* Email Input */}
      <TextInput
        style={formStyles.input}
        placeholder="Email"
        placeholderTextColor={colors.gray}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* Password Input */}
      <TextInput
        style={formStyles.input}
        placeholder="Password"
        placeholderTextColor={colors.gray}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Confirm Password Input */}
      <TextInput
        style={formStyles.input}
        placeholder="Confirm Password"
        placeholderTextColor={colors.gray}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {/* Create Account Button */}
      <TouchableOpacity onPress={handleSignIn} style={formStyles.buttonContainer}>
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={formStyles.buttonGradient}
        >
          <Text style={{ ...formStyles.buttonText, color: colors.white }}>Create Account</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Already have an account - as text link instead of button */}
      <TouchableOpacity onPress={() => router.replace('/login')} style={{ marginTop: 20 }}>
        <Text style={{ textAlign: 'center', color: colors.primary, fontWeight: 'bold' }}>
          Already have an account? <Text style={{ textDecorationLine: 'underline' }}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignInForm;
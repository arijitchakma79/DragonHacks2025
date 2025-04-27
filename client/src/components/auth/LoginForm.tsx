// src/components/auth/LoginForm.tsx

import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { formStyles, colors } from '../../styles/styles';

const LoginForm = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const DEMO_EMAIL = 'user@example.com';
  const DEMO_PASSWORD = 'password123';

  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!password.trim()) {
      setError('Password is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      return false;
    }
    return true;
  };

  const handleLogin = () => {
    setError('');
    if (!validateForm()) {
      return;
    }
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      onLoginSuccess();
    } else {
      setError('Invalid email or password');
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

      {/* LOGIN Button (with Gradient) */}
      <TouchableOpacity onPress={handleLogin} style={formStyles.buttonContainer}>
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={formStyles.buttonGradient}
        >
          <Text style={formStyles.buttonText}>Login</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* 👉 Sign Up Text Link (Not Big Button) */}
      <TouchableOpacity onPress={() => router.replace('/signIn')} style={{ marginTop: 20 }}>
        <Text style={{ textAlign: 'center', color: colors.primary, fontWeight: 'bold' }}>
          Don't have an account? <Text style={{ textDecorationLine: 'underline' }}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;

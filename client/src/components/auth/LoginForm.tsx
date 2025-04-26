import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { formStyles, colors } from '../../styles/styles';

const LoginForm = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Hardcoded credentials for demo
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
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      return false;
    }
    
    return true;
  };
  
  const handleLogin = () => {
    // Clear previous errors
    setError('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Check credentials (in a real app, this would be an API call)
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      // Call the success callback
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } else {
      setError('Invalid email or password');
    }
  };
  
  return (
    <View style={formStyles.container}>
      {/* Show error message if any */}
      {error ? <Text style={formStyles.errorText}>{error}</Text> : null}
      
      {/* Email input */}
      <TextInput
        style={formStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      {/* Password input */}
      <TextInput
        style={formStyles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      {/* Login button */}
      <TouchableOpacity style={formStyles.button} onPress={handleLogin}>
        <Text style={formStyles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;
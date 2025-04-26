import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { homeStyles, formStyles } from '../styles/styles';

const HomeScreen: React.FC = () => {
  const router = useRouter();
  
  const handleLogout = () => {
    // Navigate back to login
    router.replace('/login');
  };
  
  return (
    <View style={homeStyles.container}>
      <Text style={homeStyles.title}>Welcome!</Text>
      <Text style={homeStyles.text}>
        You've successfully logged in to the application.
      </Text>
      <TouchableOpacity 
        style={homeStyles.button}
        onPress={handleLogout}
      >
        <Text style={formStyles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
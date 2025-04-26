/*app.index.tsx */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import LoginScreen from '@/src/screens/LoginScreen';
import HomeScreen from '@/src/screens/HomeScreen';

// Create navigation stack
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          title: 'Home',
          headerBackVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default App
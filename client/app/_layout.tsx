import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        // Hide the header on all screens by default
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signIn" options={{ headerShown: false }} />
      <Stack.Screen 
        name="home" 
        options={{ 
          headerShown: false,
          title: 'Home',
          headerBackVisible: false,
        }} 
      />
      {/* Add other screens as needed */}
    </Stack>
  );
}
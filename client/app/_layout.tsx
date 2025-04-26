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
      <Stack.Screen 
        name="home" 
        options={{ 
          // Optionally show the header on the home screen with a title
          headerShown: true,
          title: 'Welcome',
          // Prevent going back to login screen
          headerBackVisible: false,
        }} 
      />
      {/* Add other screens as needed */}
    </Stack>
  );
}
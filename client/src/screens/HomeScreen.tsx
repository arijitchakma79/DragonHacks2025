import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { homeStyles, formStyles } from '../styles/styles';

// Import tab components
import HomeTab from '../components/tabs/HomeTab';
import AddImageTab from '../components/tabs/AddImageTab';
import HistoryTab from '../components/tabs/HistoryTab';
import AskAITab from '../components/tabs/AskAITab';

// Import tab navigation
import TabNavigation from '../components/TabNavigation';

const HomeScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Home');
  
  const handleLogout = () => {
    router.replace('/login');
  };
  
  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
  };
  
  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeTab />;
      case 'AddImage':
        return <AddImageTab />;
      case 'History':
        return <HistoryTab />;
      case 'AskAI':
        return <AskAITab />;
      default:
        return <HomeTab />;
    }
  };
  
  return (
    <View style={{ flex: 1 }}>
      <View style={[homeStyles.container, { paddingBottom: 70 }]}>
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
        
        {/* Render active tab content */}
        {renderTabContent()}
      </View>
      
      {/* Bottom Navigation Bar */}
      <TabNavigation 
        activeTab={activeTab} 
        onTabPress={handleTabPress} 
      />
    </View>
  );
};

export default HomeScreen;
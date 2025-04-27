// src/screens/HomeScreen.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { homeStyles, colors } from '../styles/styles';
import { HomeScreenStyles as styles } from '../styles/HomeScreenStyles';

import HomeTab from '../components/tabs/HomeTab';
import AddImageTab from '../components/tabs/AddImageTab';
import HistoryTab from '../components/tabs/HistoryTab';
import AskAITab from '../components/tabs/AskAITab';
import TabNavigation from '../components/TabNavigation';

const HomeScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Home');
  const username = 'John Doe';

  const handleLogout = () => {
    router.replace('/login');
  };

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Top Row - Logout Left, Profile Right */}
      <View style={styles.topRow}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.profileImage}
        />
      </View>

      {/* Tab Content Full Screen */}
      <View style={{ flex: 1 }}>
        {renderTabContent()}
      </View>

      {/* Bottom Navigation */}
      <TabNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

export default HomeScreen;


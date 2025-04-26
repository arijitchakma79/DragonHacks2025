import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { navStyles } from '../styles/navStyles';
import { Ionicons } from '@expo/vector-icons'; 

type TabNavigationProps = {
  activeTab: string;
  onTabPress: (tabName: string) => void;
};

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabPress }) => {
  return (
    <View style={navStyles.navContainer}>
      <TouchableOpacity
        style={navStyles.tabItem}
        onPress={() => onTabPress('Home')}
      >
        <Ionicons 
          name={activeTab === 'Home' ? 'home' : 'home-outline'} 
          size={24} 
          color={activeTab === 'Home' ? '#007AFF' : '#8E8E93'} 
        />
        <Text style={activeTab === 'Home' ? navStyles.activeTabText : navStyles.tabText}>
          Home
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={navStyles.tabItem}
        onPress={() => onTabPress('AddImage')}
      >
        <Ionicons 
          name={activeTab === 'AddImage' ? 'image' : 'image-outline'} 
          size={24} 
          color={activeTab === 'AddImage' ? '#007AFF' : '#8E8E93'} 
        />
        <Text style={activeTab === 'AddImage' ? navStyles.activeTabText : navStyles.tabText}>
          Add Image
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={navStyles.tabItem}
        onPress={() => onTabPress('History')}
      >
        <Ionicons 
          name={activeTab === 'History' ? 'time' : 'time-outline'} 
          size={24} 
          color={activeTab === 'History' ? '#007AFF' : '#8E8E93'} 
        />
        <Text style={activeTab === 'History' ? navStyles.activeTabText : navStyles.tabText}>
          History
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={navStyles.tabItem}
        onPress={() => onTabPress('AskAI')}
      >
        <Ionicons 
          name={activeTab === 'AskAI' ? 'chatbubble' : 'chatbubble-outline'} 
          size={24} 
          color={activeTab === 'AskAI' ? '#007AFF' : '#8E8E93'} 
        />
        <Text style={activeTab === 'AskAI' ? navStyles.activeTabText : navStyles.tabText}>
          Ask AI
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TabNavigation;
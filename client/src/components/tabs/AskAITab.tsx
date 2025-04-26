import React from 'react';
import { View, Text } from 'react-native';
import { tabContentStyles } from '../../styles/tabStyles';

const AskAITab = () => {
  return (
    <View style={tabContentStyles.container}>
      <Text style={tabContentStyles.title}>Ask AI Tab</Text>
      <Text style={tabContentStyles.text}>This is the Ask AI tab content</Text>
    </View>
  );
};

export default AskAITab;
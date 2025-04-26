import React from 'react';
import { View, Text } from 'react-native';
import { tabContentStyles } from '../../styles/tabStyles';

const HistoryTab = () => {
  return (
    <View style={tabContentStyles.container}>
      <Text style={tabContentStyles.title}>History Tab</Text>
      <Text style={tabContentStyles.text}>This is the History tab content</Text>
    </View>
  );
};

export default HistoryTab;
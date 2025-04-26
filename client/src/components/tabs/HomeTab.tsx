import React from 'react';
import { View, Text } from 'react-native';
import { tabContentStyles } from '../../styles/tabStyles';

const HomeTab = () => {
  return (
    <View style={tabContentStyles.container}>
      <Text style={tabContentStyles.title}>Home Tab</Text>
      <Text style={tabContentStyles.text}>This is the Home tab content</Text>
    </View>
  );
};

export default HomeTab;
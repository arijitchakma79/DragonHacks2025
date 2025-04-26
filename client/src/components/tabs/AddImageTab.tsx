import React from 'react';
import { View, Text } from 'react-native';
import { tabContentStyles } from '../../styles/tabStyles'

const AddImageTab = () => {
  return (
    <View style={tabContentStyles.container}>
      <Text style={tabContentStyles.title}>Add Image Tab</Text>
      <Text style={tabContentStyles.text}>This is the Add Image tab content</Text>
    </View>
  );
};

export default AddImageTab;
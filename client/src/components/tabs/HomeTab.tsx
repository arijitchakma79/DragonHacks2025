// src/components/tabs/HomeTab.tsx

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { LineChart, Grid } from 'react-native-svg-charts';
import { tabContentStyles } from '../../styles/tabStyles';
import * as shape from 'd3-shape';

// Import wound data
import sampleWoundData from '../../data/sampleWoundData.json';

const HomeTab = () => {
  const dates = sampleWoundData.map(item => item.date);
  const lengths = sampleWoundData.map(item => item.length_cm);
  const widths = sampleWoundData.map(item => item.width_cm);
  const areas = sampleWoundData.map(item => item.length_cm * item.width_cm);

  return (
    <ScrollView 
      contentContainerStyle={{
        padding: 20,
        alignItems: 'center',   // ✅ move it here
        justifyContent: 'center' // ✅ move it here
      }}
    >
      <Text style={tabContentStyles.title}>📊 Wound Healing Progress</Text>

      {/* Time vs Length */}
      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Time vs Length (cm)</Text>
      <LineChart
        style={{ height: 200, width: '100%', marginVertical: 10 }}
        data={lengths}
        svg={{ stroke: 'blue' }}
        contentInset={{ top: 20, bottom: 20 }}
        curve={shape.curveMonotoneX}
      >
        <Grid />
      </LineChart>

      {/* Time vs Width */}
      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Time vs Width (cm)</Text>
      <LineChart
        style={{ height: 200, width: '100%', marginVertical: 10 }}
        data={widths}
        svg={{ stroke: 'green' }}
        contentInset={{ top: 20, bottom: 20 }}
        curve={shape.curveMonotoneX}
      >
        <Grid />
      </LineChart>

      {/* Time vs Area */}
      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Time vs Area (cm²)</Text>
      <LineChart
        style={{ height: 200, width: '100%', marginVertical: 10 }}
        data={areas}
        svg={{ stroke: 'purple' }}
        contentInset={{ top: 20, bottom: 20 }}
        curve={shape.curveMonotoneX}
      >
        <Grid />
      </LineChart>

    </ScrollView>
  );
};

export default HomeTab;

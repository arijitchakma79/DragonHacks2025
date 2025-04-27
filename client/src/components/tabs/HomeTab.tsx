// src/components/tabs/HomeTab.tsx

import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
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
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Text style={[tabContentStyles.title, { marginBottom: 10 }]}>📊 Wound Healing Dashboard</Text>

      {/* Latest Summary */}
      <View style={{
        width: '100%',
        backgroundColor: '#f0f8ff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 4,
      }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Latest Wound Summary</Text>
        <Text>📅 {sampleWoundData[sampleWoundData.length - 1].date}</Text>
        <Text>📏 Length: {sampleWoundData[sampleWoundData.length - 1].length_cm} cm</Text>
        <Text>📏 Width: {sampleWoundData[sampleWoundData.length - 1].width_cm} cm</Text>
        <Text>📐 Area: {sampleWoundData[sampleWoundData.length - 1].length_cm * sampleWoundData[sampleWoundData.length - 1].width_cm} cm²</Text>
      </View>

      {/* Graph 1 */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Time vs Length (cm)</Text>
        <LineChart
          style={styles.chart}
          data={lengths}
          svg={{ stroke: 'blue' }}
          contentInset={{ top: 20, bottom: 20 }}
          curve={shape.curveMonotoneX}
        >
          <Grid />
        </LineChart>
      </View>

      {/* Graph 2 */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Time vs Width (cm)</Text>
        <LineChart
          style={styles.chart}
          data={widths}
          svg={{ stroke: 'green' }}
          contentInset={{ top: 20, bottom: 20 }}
          curve={shape.curveMonotoneX}
        >
          <Grid />
        </LineChart>
      </View>

      {/* Graph 3 */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Time vs Area (cm²)</Text>
        <LineChart
          style={styles.chart}
          data={areas}
          svg={{ stroke: 'purple' }}
          contentInset={{ top: 20, bottom: 20 }}
          curve={shape.curveMonotoneX}
        >
          <Grid />
        </LineChart>
      </View>

    </ScrollView>
  );
};

const styles = {
  chartCard: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  chart: {
    height: 200,
    width: Dimensions.get('window').width - 80,
  },
};

export default HomeTab;

// src/components/tabs/HistoryTab.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { tabContentStyles } from '../../styles/tabStyles';

const API_BASE_URL = 'http://10.250.106.84:5000'; 

const HistoryTab = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = 'John Doe'; 
  const router = useRouter();

  useEffect(() => {
    const fetchWoundRecords = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/user-wounds/${username}`);
        setRecords(res.data || []);
      } catch (error) {
        console.error('Error fetching wound records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWoundRecords();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  if (!records.length) {
    return <Text style={{ textAlign: 'center', marginTop: 40 }}>No wound records yet.</Text>;
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={tabContentStyles.title}>Your Wound Healing History</Text>

      {records.map((record, index) => (
        <View key={index} style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>
            📅 {record.date} at {record.time}
          </Text>

          <Text style={{ fontSize: 14, marginTop: 4 }}>
            📏 Length: {record.length_cm} cm, Width: {record.width_cm} cm
          </Text>

          <Image
            source={{ uri: `${API_BASE_URL}/download/images/${record.image_file_id}` }}
            style={{ width: '100%', height: 200, borderRadius: 12, marginTop: 10 }}
            resizeMode="cover"
          />

          <TouchableOpacity
            style={{
              marginTop: 10,
              backgroundColor: '#007AFF',
              paddingVertical: 12,
              borderRadius: 10,
            }}
            onPress={() => {
              console.log('Opening 3D model:', record.model_file_id);
              router.push({ pathname: '/model-viewer', params: { fileId: record.model_file_id } });
            }}
          >
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>
              View 3D Model
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

export default HistoryTab;

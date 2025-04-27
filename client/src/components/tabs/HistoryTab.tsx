import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { tabContentStyles } from '../../styles/tabStyles';

const API_BASE_URL = 'http://10.250.106.84:5000';

const HistoryTab = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleImages, setVisibleImages] = useState({});
  const username = 'John Doe';

  const router = useRouter();

  useEffect(() => {
    const fetchWoundRecords = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/user-wounds/${username}`);
        setRecords(res.data || []);
        
        // Initialize all images as hidden
        const initialVisibility = {};
        (res.data || []).forEach((record, index) => {
          initialVisibility[index] = false;
        });
        setVisibleImages(initialVisibility);
      } catch (error) {
        console.error('Error fetching wound records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWoundRecords();
  }, []);

  // Toggle image visibility
  const toggleImageVisibility = (index) => {
    setVisibleImages(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

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
        <View key={index} style={{ marginBottom: 20, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, padding: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>
            📅 {record.date} at {record.time}
          </Text>

          <Text style={{ fontSize: 14, marginTop: 4 }}>
            📏 Length: {record.length_cm} cm, Width: {record.width_cm} cm
          </Text>

          {/* Image or placeholder based on visibility state */}
          <View style={{ width: '100%', height: 200, borderRadius: 12, marginTop: 10, overflow: 'hidden' }}>
            {visibleImages[index] ? (
              // Visible Image
              <View style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image
                  source={{ uri: `${API_BASE_URL}/download/images/${record.image_file_id}` }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
                <TouchableOpacity 
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    borderRadius: 6,
                  }}
                  onPress={() => toggleImageVisibility(index)}
                >
                  <Ionicons name="eye-off" size={18} color="#fff" />
                  <Text style={{ color: '#fff', marginLeft: 5, fontWeight: '600', fontSize: 14 }}>
                    Hide Image
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Hidden Image Placeholder
              <View style={{ 
                width: '100%', 
                height: '100%', 
                backgroundColor: '#f3f3f3',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Ionicons name="medical" size={40} color="#007AFF" />
                <Text style={{ fontSize: 16, color: '#555', marginTop: 10, marginBottom: 15 }}>
                  Image Hidden
                </Text>
                <TouchableOpacity 
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#007AFF',
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 8,
                  }}
                  onPress={() => toggleImageVisibility(index)}
                >
                  <Ionicons name="eye" size={22} color="#fff" />
                  <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16, marginLeft: 8 }}>
                    See Image
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

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
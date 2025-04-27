import React, { useState } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

// Your server URL
const API_BASE_URL = 'http://10.250.106.84:5000';

const AddImageTab = () => {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showImage, setShowImage] = useState(false); // State to control image visibility
  const username = 'John Doe'; // hardcoded user

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setSelectedImageUri(uri);
      setShowImage(false); // Hide image when a new one is taken
      await uploadSelectedImage(uri);
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Media Library permission is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setSelectedImageUri(uri);
      setShowImage(false); // Hide image when a new one is selected
      await uploadSelectedImage(uri);
    }
  };

  const uploadSelectedImage = async (uri: string) => {
    try {
      setUploading(true);

      const formData = new FormData();

      const response = await fetch(uri);
      const blob = await response.blob();

      formData.append('file', {
        uri,
        type: blob.type || 'image/jpeg',
        name: 'wound_image.jpg',
      } as any);

      formData.append('username', username);

      await axios.post(`${API_BASE_URL}/upload-wound`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Wound record uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload wound record.');
    } finally {
      setUploading(false);
    }
  };

  // Toggle image visibility
  const toggleImageVisibility = () => {
    setShowImage(!showImage);
  };

  return (
    <View style={styles.container}>
      {/* Greeting */}
      <Text style={styles.greeting}>Hi {username} 👋</Text>

      {/* Title */}
      <Text style={styles.title}>Upload Wound Image</Text>

      {/* Image Section */}
      {selectedImageUri && (
        <View style={styles.imageContainer}>
          {/* Hidden/Covered Image */}
          {!showImage ? (
            <View style={styles.hiddenImageContainer}>
              <View style={styles.hiddenImagePlaceholder}>
                <Ionicons name="medical" size={40} color="#007AFF" />
                <Text style={styles.hiddenImageText}>Image Hidden</Text>
                <TouchableOpacity 
                  style={styles.seeButton}
                  onPress={toggleImageVisibility}
                >
                  <Ionicons name="eye" size={22} color="#fff" />
                  <Text style={styles.seeButtonText}>See Image</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // Visible Image
            <View style={styles.visibleImageContainer}>
              <Image source={{ uri: selectedImageUri }} style={styles.previewImage} />
              <TouchableOpacity 
                style={styles.hideButton}
                onPress={toggleImageVisibility}
              >
                <Ionicons name="eye-off" size={18} color="#fff" />
                <Text style={styles.hideButtonText}>Hide Image</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Uploading Indicator */}
      {uploading && (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 20 }} />
      )}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.uploadButton} onPress={handleTakePhoto} disabled={uploading}>
          <Ionicons name="camera" size={22} color="#fff" />
          <Text style={styles.uploadButtonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadButton} onPress={handlePickImage} disabled={uploading}>
          <Ionicons name="image" size={22} color="#fff" />
          <Text style={styles.uploadButtonText}>Pick from Gallery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddImageTab;

// 📜 STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imageContainer: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  hiddenImageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  hiddenImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f3f3f3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hiddenImageText: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
    marginBottom: 15,
  },
  visibleImageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    resizeMode: 'cover',
  },
  seeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  seeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  hideButton: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  hideButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 5,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
    marginTop: 10,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 10,
  },
});
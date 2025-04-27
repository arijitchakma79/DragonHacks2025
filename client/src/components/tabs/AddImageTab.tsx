// src/components/tabs/AddImageTab.tsx

import React, { useState } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { tabContentStyles } from '../../styles/tabStyles';
import { AddImageStyles as styles } from '../../styles/addImageStyles';
import { handleUpload } from '@/src/utils/uploadFileUtils';
import { Ionicons } from '@expo/vector-icons';

const AddImageTab = () => {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
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
      await uploadSelectedImage(uri);
    }
  };

  const uploadSelectedImage = async (uri: string) => {
    try {
      setUploading(true);
      await handleUpload(uri, username);
      alert('Image uploaded successfully!');
    } catch (error) {
      alert('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Greeting */}
      <Text style={styles.greeting}>Hi {username}</Text>

      {/* Title */}
      <Text style={styles.title}>Upload an Image</Text>

      {/* Image Preview */}
      {selectedImageUri && (
        <Image source={{ uri: selectedImageUri }} style={styles.previewImage} />
      )}

      {/* Uploading Indicator */}
      {uploading && (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 20 }} />
      )}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.uploadButton} onPress={handleTakePhoto} disabled={uploading}>
          <Ionicons name="camera-outline" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.uploadButtonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadButton} onPress={handlePickImage} disabled={uploading}>
          <Ionicons name="image-outline" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.uploadButtonText}>Upload from Files</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddImageTab;

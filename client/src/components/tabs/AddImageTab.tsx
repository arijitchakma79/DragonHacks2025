// src/components/tabs/AddImageTab.tsx

import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { tabContentStyles } from '../../styles/tabStyles';
import { AddImageStyles as styles } from '../../styles/addImageStyles';


const AddImageTab = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Function to take photo using Camera
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
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Function to pick image from Files (Gallery)
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
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <View style={tabContentStyles.container}>
      <Text style={tabContentStyles.title}>Add Image</Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Button title="Take Photo" onPress={handleTakePhoto} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Upload from Files" onPress={handlePickImage} />
      </View>

      {/* Display Selected Image */}
      {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          style={styles.previewImage}
          resizeMode="contain"
        />
      )}
    </View>
  );
};


export default AddImageTab;

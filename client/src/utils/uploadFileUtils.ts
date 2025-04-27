// src/utils/uploadFileUtils.ts

import { uploadImage } from '../apis/uploadApi'; 

export const handleUpload = async (selectedImageUri: string, username: string) => {
  try {
    const response = await uploadImage(selectedImageUri, username);
    console.log('Upload success:', response);
    alert('Image uploaded successfully!');
    return response;
  } catch (error) {
    console.error('Upload error:', error);
    alert('Failed to upload image');
    throw error;
  }
};

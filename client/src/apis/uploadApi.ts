import axios from 'axios';

const API_BASE_URL = 'http://10.250.106.84:5000'; 

export const uploadImage = async (uri: string, username: string) => {
  try {
    const formData = new FormData();

    const response = await fetch(uri);
    const blob = await response.blob();

    formData.append('file', {
      uri: uri,
      name: 'photo.jpg',
      type: blob.type || 'image/jpeg',
    } as any);

    formData.append('username', username);

    const res = await axios.post(`${API_BASE_URL}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Upload success:', res.data);
    return res.data;
  } catch (error: any) {
    console.error('Upload error:', error);
    throw error;
  }
};

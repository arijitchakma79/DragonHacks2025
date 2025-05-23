// src/utils/fileUtils.ts

// Utility to convert a local file URI (e.g., from Expo ImagePicker) to Blob
export const uriToBlob = async (uri: string): Promise<Blob> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };
  
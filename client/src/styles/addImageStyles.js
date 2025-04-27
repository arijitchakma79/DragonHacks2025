// src/styles/addImageStyles.ts

import { StyleSheet } from 'react-native';

export const AddImageStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3E8FF', // 🌸 light purple background
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#555',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  previewImage: {
    width: 300,
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff', // White background inside preview
  },
  buttonContainer: {
    marginTop: 20,
    width: '90%',
    alignItems: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // ✅ Center both icon and text
    backgroundColor: '#7b2ff7', // 🌟 Nice purple button (you can change)
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 15,
    width: '100%',
  },
  icon: {
    marginRight: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

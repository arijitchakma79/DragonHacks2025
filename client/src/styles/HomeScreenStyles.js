// src/styles/HomeScreenStyles.ts

import { StyleSheet } from 'react-native';
import { colors } from './styles';  // Assuming you import colors

export const HomeScreenStyles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,         // ✅ Reduce paddingTop
    paddingBottom: 10,      // ✅ Add paddingBottom
    backgroundColor: colors.white,
  },
  logoutButton: {
    backgroundColor: colors.error,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
  },
});

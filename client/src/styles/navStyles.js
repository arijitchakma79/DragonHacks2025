// In your navStyles.ts file
export const navStyles = StyleSheet.create({
    navContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: '#E0E0E0',
      paddingVertical: 10,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    tabItem: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 8,
    },
    tabText: {
      fontSize: 12,
      color: '#8E8E93',
      marginTop: 4,
    },
    activeTabText: {
      fontSize: 12,
      color: '#007AFF',
      fontWeight: '500',
      marginTop: 4,
    },
  });
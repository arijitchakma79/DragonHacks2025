import { StyleSheet } from 'react-native';

// 🌿 Updated Color Palette
export const colors = {
  primary: '#92d4bc',      // Bud Green
  secondary: '#115642',    // Dark Green
  white: '#FFFFFF',
  black: '#000000',
  gray: '#AAAAAA',
  lightGray: '#F0F8F0',    // Light greenish white
  error: '#FF4C4C',        // Soft red
  text: '#2E2E2E',         // Dark text
  gradientStart: '#00c3ff', // Gradient start (Light Blue)
  gradientEnd: '#7b2ff7',   // Gradient end (Purple)
};

const fonts = {
  regular: 16,
  large: 24,
  small: 14,
};

// 🖋️ Form Styles (Login & SignIn)
export const formStyles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: colors.lightGray,
    fontSize: fonts.regular,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.error,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
  buttonGradient: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: fonts.regular,
    fontWeight: 'bold',
  },
  errorText: {
    color: colors.error,
    fontSize: fonts.small,
    marginBottom: 10,
    textAlign: 'center',
  },
});

// 📄 Screen Styles
export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.white, // White background for login/signup
  },
  title: {
    fontSize: fonts.large,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: colors.text, // Dark text
  },
});



export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
    textAlign: 'center',
    color: '#555',
  },
  button: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});


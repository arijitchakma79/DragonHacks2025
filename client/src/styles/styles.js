import { StyleSheet } from 'react-native';

// Hardcoded style values
export const colors = {
  primary: '#3498db',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#CCCCCC',
  lightGray: '#F5F5F5',
  error: '#FF0000',
  text: '#333333',
};

const fonts = {
  regular: 16,
  large: 24,
  small: 14,
};

// Login Form styles
export const formStyles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: colors.lightGray,
  },
  inputError: {
    borderColor: colors.error,
  },
  button: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
  },
});

// Login Screen styles
export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: fonts.large,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: colors.text,
  },
});

// Home Screen styles
export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: fonts.large,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.text,
  },
  text: {
    fontSize: fonts.regular,
    marginBottom: 30,
    textAlign: 'center',
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: fonts.regular,
    fontWeight: 'bold',
  },
});
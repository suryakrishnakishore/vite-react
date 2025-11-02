// src/styles/theme.js
import { DefaultTheme } from 'react-native-paper';

export const colors = {
  primary: '#2E7D32', // Green
  secondary: '#FFD700', // Gold
  accent: '#4CAF50',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  error: '#F44336',
  warning: '#FF9800',
  success: '#4CAF50',
  text: '#212121',
  disabled: '#BDBDBD',
  placeholder: '#9E9E9E',
  backdrop: '#000000',
  notification: '#F44336',
  
  // A1 Aligners Brand Colors
  gold: '#FFD700',
  darkGold: '#B8860B',
  lightGold: '#FFF8DC',
  
  // Green Theme
  darkGreen: '#1B5E20',
  lightGreen: '#C8E6C9',
  mediumGreen: '#4CAF50',
  
  brandGreen:'#003E33',
  brandWhite:'#FFFFFF'
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...colors,
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'System',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
  },
};

export const globalStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    margin: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  button: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  goldButton: {
    backgroundColor: colors.gold,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.disabled,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  body: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    color: colors.placeholder,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // Web responsive styles
  webContainer: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  webCard: {
    maxWidth: 400,
    width: '100%',
  },
};

export const animations = {
  fadeIn: {
    opacity: 1,
    transform: [{ scale: 1 }],
  },
  fadeOut: {
    opacity: 0,
    transform: [{ scale: 0.95 }],
  },
  slideUp: {
    transform: [{ translateY: 0 }],
  },
  slideDown: {
    transform: [{ translateY: 20 }],
  },
};
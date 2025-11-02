// src/styles/colors.js

// A1 Aligners Brand Colors
export const brandColors = {
  gold: '#FFD700',
  darkGold: '#B8860B',
  lightGold: '#FFF8DC',
  deepGold: '#DAA520',
};

// Green Medical Theme
export const greenColors = {
  primary: '#2E7D32',
  darkGreen: '#1B5E20',
  mediumGreen: '#4CAF50',
  lightGreen: '#C8E6C9',
  accent: '#66BB6A',
};

// Semantic Colors
export const semanticColors = {
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
};

// Neutral Colors
export const neutralColors = {
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  placeholder: '#9E9E9E',
  disabled: '#BDBDBD',
  divider: '#E0E0E0',
  backdrop: 'rgba(0, 0, 0, 0.5)',
};

// Status Colors
export const statusColors = {
  pending: '#FF9800',
  inProgress: '#2196F3',
  completed: '#4CAF50',
  cancelled: '#F44336',
  scheduled: '#9C27B0',
};

// Gradient Colors
export const gradientColors = {
  primaryGradient: ['#2E7D32', '#4CAF50'],
  goldGradient: ['#FFD700', '#FFA000'],
  backgroundGradient: ['#C8E6C9', '#F5F5F5', '#FFF8DC'],
  cardGradient: ['#FFFFFF', '#F8F9FA'],
};

// Export main colors object
export const colors = {
  // Brand colors
  ...brandColors,
  
  // Theme colors
  ...greenColors,
  
  // Semantic colors
  ...semanticColors,
  
  // Neutral colors
  ...neutralColors,
  
  // Status colors
  ...statusColors,
  
  // Additional theme colors for React Native Paper
  notification: '#F44336',
  
  // Shadow color
  shadow: '#000000',
  
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.3)',
  overlayLight: 'rgba(0, 0, 0, 0.1)',
  
  // Border colors
  border: '#E0E0E0',
  borderFocus: '#2E7D32',
  
  // Input colors
  inputBackground: '#FFFFFF',
  inputBorder: '#E0E0E0',
  inputFocus: '#2E7D32',
  inputError: '#F44336',
  
  // Button variations
  buttonPrimary: '#2E7D32',
  buttonSecondary: '#4CAF50',
  buttonGold: '#FFD700',
  buttonDanger: '#F44336',
  buttonOutline: 'transparent',
  
  // Card colors
  cardBackground: '#FFFFFF',
  cardBorder: '#E0E0E0',
  cardShadow: 'rgba(0, 0, 0, 0.1)',
  
  // Navigation colors
  tabBarBackground: '#FFFFFF',
  tabBarInactive: '#9E9E9E',
  tabBarActive: '#2E7D32',
  
  // Modal colors
  modalBackground: '#FFFFFF',
  modalOverlay: 'rgba(0, 0, 0, 0.5)',
  
  // Specific component colors
  headerDoctor: '#2E7D32',
  headerA1: '#FFD700',
  
  // State colors with opacity
  successLight: 'rgba(76, 175, 80, 0.1)',
  warningLight: 'rgba(255, 152, 0, 0.1)',
  errorLight: 'rgba(244, 67, 54, 0.1)',
  infoLight: 'rgba(33, 150, 243, 0.1)',
};

// Color utilities
export const colorUtils = {
  // Add opacity to hex color
  addOpacity: (hexColor, opacity) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },
  
  // Lighten color
  lighten: (hexColor, amount = 0.1) => {
    const hex = hexColor.replace('#', '');
    const r = Math.min(255, parseInt(hex.substring(0, 2), 16) + Math.round(255 * amount));
    const g = Math.min(255, parseInt(hex.substring(2, 4), 16) + Math.round(255 * amount));
    const b = Math.min(255, parseInt(hex.substring(4, 6), 16) + Math.round(255 * amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  },
  
  // Darken color
  darken: (hexColor, amount = 0.1) => {
    const hex = hexColor.replace('#', '');
    const r = Math.max(0, parseInt(hex.substring(0, 2), 16) - Math.round(255 * amount));
    const g = Math.max(0, parseInt(hex.substring(2, 4), 16) - Math.round(255 * amount));
    const b = Math.max(0, parseInt(hex.substring(4, 6), 16) - Math.round(255 * amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  },
};

export default colors;
// src/styles/globalStyles.js
import { StyleSheet, Platform, Dimensions } from 'react-native';
import { colors } from './colors';

const { width, height } = Dimensions.get('window');

// Responsive breakpoints
export const breakpoints = {
  small: 0,
  medium: 768,
  large: 1024,
  xlarge: 1440,
};

// Spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius scale
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  circle: 9999,
};

// Font sizes
export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Font weights
export const fontWeight = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

// Shadow styles
export const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  large: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  xlarge: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
};

// Global styles
export const globalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Layout styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  column: {
    flexDirection: 'column',
  },
  
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  spaceAround: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  
  spaceEvenly: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  
  // Web responsive container
  webContainer: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  
  // Card styles
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.medium,
  },
  
  cardLarge: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.large,
  },
  
  cardSmall: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    ...shadows.small,
  },
  
  // Button styles
  button: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonSmall: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 36,
  },
  
  buttonLarge: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    minHeight: 56,
  },
  
  primaryButton: {
    backgroundColor: colors.primary,
  },
  
  goldButton: {
    backgroundColor: colors.gold,
  },
  
  secondaryButton: {
    backgroundColor: colors.accent,
  },
  
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  
  dangerButton: {
    backgroundColor: colors.error,
  },
  
  // Input styles
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    color: colors.text,
    minHeight: 48,
  },
  
  inputFocused: {
    borderColor: colors.inputFocus,
  },
  
  inputError: {
    borderColor: colors.inputError,
  },
  
  textArea: {
    textAlignVertical: 'top',
    paddingTop: spacing.md,
    minHeight: 100,
  },
  
  // Text styles
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  
  subtitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  
  heading: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  
  body: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 24,
  },
  
  bodyLarge: {
    fontSize: fontSize.lg,
    color: colors.text,
    lineHeight: 26,
  },
  
  bodySmall: {
    fontSize: fontSize.sm,
    color: colors.text,
    lineHeight: 20,
  },
  
  caption: {
    fontSize: fontSize.xs,
    color: colors.placeholder,
  },
  
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  
  // Shadow utilities
  shadow: shadows.medium,
  shadowSmall: shadows.small,
  shadowLarge: shadows.large,
  shadowXLarge: shadows.xlarge,
  
  // Margin utilities
  marginXS: { margin: spacing.xs },
  marginSM: { margin: spacing.sm },
  marginMD: { margin: spacing.md },
  marginLG: { margin: spacing.lg },
  marginXL: { margin: spacing.xl },
  
  marginTopXS: { marginTop: spacing.xs },
  marginTopSM: { marginTop: spacing.sm },
  marginTopMD: { marginTop: spacing.md },
  marginTopLG: { marginTop: spacing.lg },
  marginTopXL: { marginTop: spacing.xl },
  
  marginBottomXS: { marginBottom: spacing.xs },
  marginBottomSM: { marginBottom: spacing.sm },
  marginBottomMD: { marginBottom: spacing.md },
  marginBottomLG: { marginBottom: spacing.lg },
  marginBottomXL: { marginBottom: spacing.xl },
  
  marginHorizontalXS: { marginHorizontal: spacing.xs },
  marginHorizontalSM: { marginHorizontal: spacing.sm },
  marginHorizontalMD: { marginHorizontal: spacing.md },
  marginHorizontalLG: { marginHorizontal: spacing.lg },
  marginHorizontalXL: { marginHorizontal: spacing.xl },
  
  marginVerticalXS: { marginVertical: spacing.xs },
  marginVerticalSM: { marginVertical: spacing.sm },
  marginVerticalMD: { marginVertical: spacing.md },
  marginVerticalLG: { marginVertical: spacing.lg },
  marginVerticalXL: { marginVertical: spacing.xl },
  
  // Padding utilities
  paddingXS: { padding: spacing.xs },
  paddingSM: { padding: spacing.sm },
  paddingMD: { padding: spacing.md },
  paddingLG: { padding: spacing.lg },
  paddingXL: { padding: spacing.xl },
  
  paddingTopXS: { paddingTop: spacing.xs },
  paddingTopSM: { paddingTop: spacing.sm },
  paddingTopMD: { paddingTop: spacing.md },
  paddingTopLG: { paddingTop: spacing.lg },
  paddingTopXL: { paddingTop: spacing.xl },
  
  paddingBottomXS: { paddingBottom: spacing.xs },
  paddingBottomSM: { paddingBottom: spacing.sm },
  paddingBottomMD: { paddingBottom: spacing.md },
  paddingBottomLG: { paddingBottom: spacing.lg },
  paddingBottomXL: { paddingBottom: spacing.xl },
  
  paddingHorizontalXS: { paddingHorizontal: spacing.xs },
  paddingHorizontalSM: { paddingHorizontal: spacing.sm },
  paddingHorizontalMD: { paddingHorizontal: spacing.md },
  paddingHorizontalLG: { paddingHorizontal: spacing.lg },
  paddingHorizontalXL: { paddingHorizontal: spacing.xl },
  
  paddingVerticalXS: { paddingVertical: spacing.xs },
  paddingVerticalSM: { paddingVertical: spacing.sm },
  paddingVerticalMD: { paddingVertical: spacing.md },
  paddingVerticalLG: { paddingVertical: spacing.lg },
  paddingVerticalXL: { paddingVertical: spacing.xl },
  
  // Border radius utilities
  roundedXS: { borderRadius: borderRadius.xs },
  roundedSM: { borderRadius: borderRadius.sm },
  roundedMD: { borderRadius: borderRadius.md },
  roundedLG: { borderRadius: borderRadius.lg },
  roundedXL: { borderRadius: borderRadius.xl },
  roundedCircle: { borderRadius: borderRadius.circle },
  
  // Status badge styles
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },
  
  pendingBadge: {
    backgroundColor: colors.warning,
  },
  
  completedBadge: {
    backgroundColor: colors.success,
  },
  
  errorBadge: {
    backgroundColor: colors.error,
  },
  
  infoBadge: {
    backgroundColor: colors.info,
  },
  
  // List styles
  listContainer: {
    padding: spacing.md,
  },
  
  listItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    margin: spacing.md,
    maxWidth: Platform.OS === 'web' ? 500 : '90%',
    width: '100%',
    ...shadows.xlarge,
  },
  
  // Responsive utilities
  hideOnMobile: {
    ...(width < breakpoints.medium && { display: 'none' }),
  },
  
  hideOnTablet: {
    ...(width >= breakpoints.medium && width < breakpoints.large && { display: 'none' }),
  },
  
  hideOnDesktop: {
    ...(width >= breakpoints.large && { display: 'none' }),
  },
  
  showOnMobile: {
    ...(width >= breakpoints.medium && { display: 'none' }),
  },
  
  showOnTablet: {
    ...(width < breakpoints.medium || width >= breakpoints.large) && { display: 'none' },
  },
  
  showOnDesktop: {
    ...(width < breakpoints.large && { display: 'none' }),
  },
});

export default globalStyles;
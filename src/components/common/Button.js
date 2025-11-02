// src/components/common/Button.js
import React, { useRef } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Animated, 
  ActivityIndicator,
  View 
} from 'react-native';
import { colors, globalStyles } from '../../styles/theme';

const Button = ({
  title,
  onPress,
  variant = 'primary', // primary, secondary, gold, outline, danger
  size = 'medium', // small, medium, large
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left', // left, right
  style,
  textStyle,
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    switch (variant) {
      case 'secondary':
        return [...baseStyle, styles.secondaryButton];
      case 'gold':
        return [...baseStyle, styles.goldButton];
      case 'outline':
        return [...baseStyle, styles.outlineButton];
      case 'danger':
        return [...baseStyle, styles.dangerButton];
      default:
        return [...baseStyle, styles.primaryButton];
    }
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[`${size}Text`]];
    
    switch (variant) {
      case 'secondary':
        return [...baseStyle, styles.secondaryText];
      case 'gold':
        return [...baseStyle, styles.goldText];
      case 'outline':
        return [...baseStyle, styles.outlineText];
      case 'danger':
        return [...baseStyle, styles.dangerText];
      default:
        return [...baseStyle, styles.primaryText];
    }
  };

  const isDisabled = disabled || loading;

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }] },
        isDisabled && styles.disabledContainer,
      ]}
    >
      <TouchableOpacity
        style={[
          ...getButtonStyle(),
          isDisabled && styles.disabled,
          style,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={0.8}
        {...props}
      >
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator 
              size="small" 
              color={variant === 'outline' ? colors.primary : colors.surface} 
            />
          ) : (
            <>
              {icon && iconPosition === 'left' && (
                <View style={styles.iconLeft}>
                  {icon}
                </View>
              )}
              
              <Text style={[...getTextStyle(), textStyle]}>
                {title}
              </Text>
              
              {icon && iconPosition === 'right' && (
                <View style={styles.iconRight}>
                  {icon}
                </View>
              )}
            </>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...globalStyles.shadow,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Sizes
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
  },
  
  // Variants
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.accent,
  },
  goldButton: {
    backgroundColor: colors.gold,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  dangerButton: {
    backgroundColor: colors.error,
  },
  
  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  
  // Text variants
  primaryText: {
    color: colors.surface,
  },
  secondaryText: {
    color: colors.surface,
  },
  goldText: {
    color: colors.darkGreen,
  },
  outlineText: {
    color: colors.primary,
  },
  dangerText: {
    color: colors.surface,
  },
  
  // States
  disabled: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled,
  },
  disabledContainer: {
    opacity: 0.6,
  },
  
  // Icons
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;
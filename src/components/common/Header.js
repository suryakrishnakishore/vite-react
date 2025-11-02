// src/components/common/Header.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { colors, globalStyles } from '../../styles/theme';

const Header = ({ 
  title, 
  subtitle, 
  showLogo = false, 
  showLogout = true, 
  onLogout,
  rightComponent,
  backgroundColor 
}) => {
  const { user, userType, logout } = useAuth();

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    } else {
      await logout();
    }
  };

  const getBgColor = () => {
    if (backgroundColor) return backgroundColor;
    return userType === 'a1_user' ? colors.gold : colors.primary;
  };

  const getTextColor = () => {
    return userType === 'a1_user' ? colors.darkGreen : colors.surface;
  };

  return (
    <View style={[styles.container, { backgroundColor: getBgColor() }]}>
      <View style={styles.leftSection}>
        {showLogo && (
          <View style={styles.logoContainer}>
            <Text style={[styles.logo, { color: getTextColor() }]}>
              {userType === 'a1_user' ? 'A1' : '👨‍⚕️'}
            </Text>
            {userType === 'a1_user' && (
              <Text style={[styles.logoSub, { color: getTextColor() }]}>
                ALIGNERS
              </Text>
            )}
          </View>
        )}
        
        <View style={styles.titleContainer}>
          {title && (
            <Text style={[styles.title, { color: getTextColor() }]}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text style={[styles.subtitle, { 
              color: userType === 'a1_user' ? colors.darkGold : colors.lightGreen 
            }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.rightSection}>
        {rightComponent}
        
        {showLogout && (
          <TouchableOpacity
            style={[styles.logoutButton, {
              borderColor: getTextColor(),
            }]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={[styles.logoutText, { color: getTextColor() }]}>
              Logout
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    minHeight: Platform.OS === 'ios' ? 90 : 70,
    ...globalStyles.shadow,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    marginRight: 16,
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoSub: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: -4,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
    opacity: 0.9,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginLeft: 12,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Header;
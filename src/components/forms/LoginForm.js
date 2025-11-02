// src/components/forms/LoginForm.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Button from '../common/Button';
import { colors, globalStyles } from '../../styles/theme';

const LoginForm = ({
  userType,
  onLogin,
  onRegister,
  loading = false,
  showRegisterOption = false,
}) => {
  const [formData, setFormData] = useState({
    email: userType === 'doctor' ? 'rajesh@example.com' : 'admin@a1aligners.com',
    password: userType === 'doctor' ? 'doctor123' : 'a1admin123',
    name: '',
    phone: '',
    specialization: '',
  });
  const [showRegister, setShowRegister] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Registration fields validation
    if (showRegister) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please correct the errors and try again');
      return;
    }

    if (showRegister) {
      onRegister(formData);
    } else {
      onLogin(formData.email, formData.password);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const toggleMode = () => {
    setShowRegister(!showRegister);
    setErrors({});
  };

  const renderInput = (field, placeholder, options = {}) => (
    <View style={styles.inputContainer}>
      <TextInput
        style={[
          styles.input,
          errors[field] && styles.inputError,
        ]}
        placeholder={placeholder}
        value={formData[field]}
        onChangeText={(value) => updateField(field, value)}
        placeholderTextColor={colors.placeholder}
        {...options}
      />
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.form}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.logo, { 
            color: userType === 'doctor' ? colors.primary : colors.gold 
          }]}>
            {userType === 'doctor' ? '👨‍⚕️' : 'A1'}
          </Text>
          <Text style={styles.title}>
            {showRegister ? 'Create Account' : `${userType === 'doctor' ? 'Doctor' : 'A1 Aligners'} Login`}
          </Text>
          <Text style={styles.subtitle}>
            {showRegister ? 'Join our dental network' : 'Sign in to continue'}
          </Text>
        </View>

        {/* Registration Fields */}
        {showRegister && (
          <>
            {renderInput('name', 'Full Name', {
              autoCapitalize: 'words',
            })}
            {renderInput('phone', 'Phone Number', {
              keyboardType: 'phone-pad',
            })}
            {renderInput('specialization', 'Specialization (Optional)', {
              autoCapitalize: 'words',
            })}
          </>
        )}

        {/* Login Fields */}
        {renderInput('email', 'Email Address', {
          keyboardType: 'email-address',
          autoCapitalize: 'none',
          autoCorrect: false,
        })}

        {renderInput('password', 'Password', {
          secureTextEntry: true,
        })}

        {/* Submit Button */}
        <Button
          title={showRegister ? 'Create Account' : 'Sign In'}
          onPress={handleSubmit}
          loading={loading}
          variant={userType === 'doctor' ? 'primary' : 'gold'}
          size="large"
          style={styles.submitButton}
        />

        {/* Toggle Mode */}
        {showRegisterOption && userType === 'doctor' && (
          <Button
            title={showRegister ? 'Already have an account? Sign In' : 'New doctor? Create Account'}
            onPress={toggleMode}
            variant="outline"
            style={styles.toggleButton}
          />
        )}

        {/* Demo Info */}
        <View style={styles.demoInfo}>
          <Text style={styles.demoTitle}>Demo Credentials:</Text>
          <Text style={styles.demoText}>
            {userType === 'doctor' ? (
              'Email: rajesh@example.com\nPassword: doctor123'
            ) : (
              'Email: admin@a1aligners.com\nPassword: a1admin123'
            )}
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  form: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.placeholder,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    ...globalStyles.input,
    fontSize: 16,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 1,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  toggleButton: {
    marginBottom: 24,
  },
  demoInfo: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    ...globalStyles.shadow,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    color: colors.placeholder,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    lineHeight: 16,
  },
});

export default LoginForm;
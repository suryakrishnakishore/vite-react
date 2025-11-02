// src/screens/LoginScreen.js

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
  Image,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { colors, globalStyles } from '../styles/theme';
import Loading from '../components/common/Loading';



const LoginScreen = ({ route, navigation }) => {
  const { userType } = route.params;
  const { login } = useAuth();
  const { height } = useWindowDimensions();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgot, setShowForgot] = useState(false); // NEW state for forgot password
  const [newPassword, setNewPassword] = useState('');  // NEW input for reset

  const [registerData, setRegisterData] = useState({
    name: '',
    phone: '',
    specialization: '',
  });
  const [errors, setErrors] = useState({});

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // --- Validation helpers ---
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

  const validatePhone = (phone) => /^\d{10}$/.test(phone);

  // --- Login handler ---
  const handleLogin = async () => {
    const newErrors = {};

    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Enter a valid email address';

    if (!password) newErrors.password = 'Password is required';
    else if (!validatePassword(password)) {
      newErrors.password =
        'At least 8 chars,  1 number, 1 special char';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      let response =
        userType === 'doctor'
          ? await apiService.loginDoctor(email, password)
          : await apiService.loginA1User(email, password);

      if (response.success) {
        apiService.setToken(response.token);
        await login(response.user, response.token, response.userType);
      } else {
        setErrors({ general: response.error || 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // --- Register handler ---
  const handleRegister = async () => {
    const newErrors = {};

    if (!registerData.name) newErrors.name = 'Name is required';

    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Enter a valid email address';

    if (!registerData.phone) newErrors.phone = 'Phone number is required';
    else if (!validatePhone(registerData.phone)) newErrors.phone = 'Phone must be 10 digits';

    if (!password) newErrors.password = 'Password is required';
    else if (!validatePassword(password)) {
      newErrors.password =
        'At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await apiService.registerDoctor({
        name: registerData.name,
        email,
        password,
        phone: registerData.phone,
        specialization: registerData.specialization,
      });
      console.log("Register API response:", response);

      if (response.success) {
        // 1) Switch UI back to login view (this is the key if register form is inside LoginScreen)
        setShowRegister(false);

        // 2) Clear registration inputs (optional, keeps form clean if user returns)
        setRegisterData({ name: '', phone: '', specialization: '' });
        setPassword(''); // if you want to clear the password field too
        setErrors({});

        // 3) If you actually have a separate Login screen route and want to navigate to it,
        // uncomment and replace 'Login' with your route name:
        // navigation.navigate('Login'); // <-- use only if there's a separate screen

        // 4) Notify the user
        Alert.alert('Success', 'Registration successful! Please login.', [
          { text: 'OK', onPress: () => { /* nothing needed here */ } },
        ]);
      } else {
        setErrors({ general: response.error || 'Registration failed' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // --- Forgot Password handler ---
  const handleForgotPassword = async () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Enter a valid email address';

    if (!newPassword) newErrors.newPassword = 'New password is required';
    else if (!validatePassword(newPassword)) {
      newErrors.newPassword = 'At least 8 chars, 1 number, 1 special char';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      let response =
        userType === 'doctor'
          ? await apiService.resetPasswordDoctor(email, newPassword)
          : await apiService.resetPasswordA1(email, newPassword);

      if (response.success) {
        // Switch UI back to login view (same as registration)
        setShowForgot(false);

        // Clear inputs
        setEmail('');
        setPassword('');
        setNewPassword('');
        setErrors({});

        // Notify user
        Alert.alert('Success', 'Password changed successfully! Please login.', [
          { text: 'OK', onPress: () => { /* nothing else needed here */ } },
        ]);
      } else {
        setErrors({ general: response.error || 'Password reset failed' });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setErrors({ general: 'Password reset failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };



  if (loading) return <Loading />;
  const logoBgSource = require('./logo_bg.jpg');
  const a1LogoSource = require('./a1_logo.png');

  const isMobile = height < 700;

  return (
    <ImageBackground
      source={logoBgSource}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            isMobile && styles.scrollContainerMobile
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
            {/* Header with Logo */}
            <View style={styles.header}>
                <Text style={styles.title}>
                  {userType === 'doctor' ? 'Doctor Portal' : 'Admin Portal'}
                </Text>
                <View style={styles.titleUnderline} />
                <Text style={styles.subtitle}>
                  {showRegister
                    ? 'Create your account'
                    : showForgot
                      ? 'Reset your password'
                      : 'Welcome back! Please login'}
                </Text>
              </View>

            {/* Form */}
            <View style={styles.form}>
              {showForgot ? (
                <>
                  {/* Forgot Password Form */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputIcon}>📧</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email address"
                      placeholderTextColor="rgba(0, 0, 0, 0.4)"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputIcon}>🔒</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter new password"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry
                    />
                  </View>
                  {errors.newPassword && (
                    <Text style={styles.errorText}>{errors.newPassword}</Text>
                  )}

                  {errors.general && (
                    <Text style={styles.errorText}>{errors.general}</Text>
                  )}

                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleForgotPassword}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={
                        userType === 'doctor'
                          ? ['#2e7d32', '#1b5e20']
                          : ['#ffd700', '#f9a825']
                      }
                      style={styles.buttonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          {
                            color:
                              userType === 'doctor'
                                ? colors.surface
                                : colors.darkGreen,
                          },
                        ]}
                      >
                        Change Password
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => {
                      setShowForgot(false);
                      setErrors({});
                      setEmail('');
                      setNewPassword('');
                    }}
                  >
                    <Text style={styles.linkText}>← Back to Login</Text>
                  </TouchableOpacity>

                </>
              ) : (
                <>
                  {/* Register Form (if doctor chooses Register) */}
                  {showRegister && (
                    <>
                      <View style={styles.inputContainer}>
                        <Text style={styles.inputIcon}>👤</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Full Name"
                          placeholderTextColor="rgba(255, 255, 255, 0.5)"
                          value={registerData.name}
                          onChangeText={(text) =>
                            setRegisterData({ ...registerData, name: text })
                          }
                          autoCapitalize="words"
                        />
                      </View>
                      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                      <View style={styles.inputContainer}>
                        <Text style={styles.inputIcon}>📱</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Phone Number"
                          placeholderTextColor="rgba(255, 255, 255, 0.5)"
                          value={registerData.phone}
                          onChangeText={(text) =>
                            setRegisterData({ ...registerData, phone: text })
                          }
                          keyboardType="phone-pad"
                        />
                      </View>
                      {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

                      <View style={styles.inputContainer}>
                        <Text style={styles.inputIcon}>🩺</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Specialization (Optional)"
                          placeholderTextColor="rgba(255, 255, 255, 0.5)"
                          value={registerData.specialization}
                          onChangeText={(text) =>
                            setRegisterData({ ...registerData, specialization: text })
                          }
                        />
                      </View>
                    </>
                  )}

                  {/* Login Form */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputIcon}>📧</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email address"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputIcon}>🔒</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your password"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                    />
                  </View>
                  {errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}

                  {errors.general && (
                    <Text style={styles.errorText}>{errors.general}</Text>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.button,
                      {
                        backgroundColor:
                          userType === 'doctor' ? colors.primary : colors.gold,
                      },
                    ]}
                    onPress={showRegister ? handleRegister : handleLogin}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={
                        userType === 'doctor'
                          ? ['#2e7d32', '#1b5e20']
                          : ['#ffd700', '#f9a825']
                      }
                      style={styles.buttonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          {
                            color:
                              userType === 'doctor'
                                ? colors.surface
                                : colors.darkGreen,
                          },
                        ]}
                      >
                        {showRegister ? '✓ Create Account' : 'Sign In'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  {userType === 'doctor' && (
                    <TouchableOpacity
                      style={styles.linkButton}
                      onPress={() => {
                        setShowRegister(!showRegister);
                        setErrors({});
                      }}
                    >
                      <Text style={styles.linkText}>
                        {showRegister
                          ? '← Already have an account? Sign in'
                          : '+ New doctor? Create account'}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {!showRegister && (
                    <TouchableOpacity
                      style={styles.forgotButton}
                      onPress={() => {
                        setShowForgot(true);
                        setErrors({});
                      }}
                    >
                      <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>
                  )}

                </>
              )}
            </View>

            {/* Back to Home Link */}
            <TouchableOpacity
              style={styles.homeButton}
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Landing' }],
                })
              }
            >
              <Text style={styles.homeButtonText}>← Back to Home</Text>
            </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: '#041710',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4, 23, 16, 0.82)',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    minHeight: '100%',
  },
  scrollContainerMobile: {
    paddingVertical: 20,
    justifyContent: 'flex-start',
  },
  content: {
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderRadius: 24,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.7,
    shadowRadius: 35,
    elevation: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(46, 125, 50, 0.4)',
  },
  contentMobile: {
    padding: 28,
    borderRadius: 20,
    marginVertical: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  titleUnderline: {
    width: 70,
    height: 4,
    backgroundColor: colors.gold,
    borderRadius: 2,
    marginBottom: 14,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 22,
  },
  form: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    marginBottom: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(46, 125, 50, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  inputIcon: {
    fontSize: 22,
    marginRight: 14,
    opacity: 0.9,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '500',
    outlineStyle: 'none',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 0,
    fontWeight: '600',
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    width: '100%',
    maxWidth: 480,
    textAlign: 'left',
    alignSelf: 'center',
  },
  button: {
    borderRadius: 12,
    marginTop: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 1,
  },
  linkButton: {
    marginTop: 14,
    alignItems: 'center',
    paddingVertical: 10,
  },
  linkText: {
    fontSize: 15,
    color: 'rgba(255, 215, 0, 0.95)',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  forgotButton: {
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 8,
  },
  forgotText: {
    fontSize: 15,
    color: colors.gold,
    fontWeight: '700',
    textDecorationLine: 'underline',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  homeButton: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
    shadowColor: '#000',
  },
  homeButtonText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default LoginScreen;

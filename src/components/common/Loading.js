// src/components/common/Loading.js
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, globalStyles } from '../../styles/theme';

const Loading = ({ message = 'Loading...' }) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Spin animation
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    // Fade in animation
    const fadeAnimation = Animated.timing(fadeValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    });

    fadeAnimation.start();
    spinAnimation.start();

    return () => {
      spinAnimation.stop();
      fadeAnimation.stop();
    };
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeValue }]}>
      <View style={styles.content}>
        <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
          <Text style={styles.spinnerText}>A1</Text>
        </Animated.View>
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...globalStyles.centered,
    backgroundColor: colors.background,
  },
  content: {
    alignItems: 'center',
  },
  spinner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: colors.lightGold,
    borderTopColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  spinnerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gold,
  },
  message: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
});

export default Loading;
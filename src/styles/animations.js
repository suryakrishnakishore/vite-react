// src/styles/animations.js
import { Animated, Easing } from 'react-native';

// Animation durations
export const durations = {
  fastest: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  slowest: 800,
};

// Easing functions
export const easings = {
  linear: Easing.linear,
  ease: Easing.ease,
  easeIn: Easing.in(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  easeInOut: Easing.inOut(Easing.ease),
  bounce: Easing.bounce,
  elastic: Easing.elastic(2),
  spring: Easing.elastic(1.3),
};

// Pre-defined animations
export const animations = {
  // Fade animations
  fadeIn: (animatedValue, duration = durations.normal) => {
    return Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      easing: easings.easeOut,
      useNativeDriver: true,
    });
  },

  fadeOut: (animatedValue, duration = durations.normal) => {
    return Animated.timing(animatedValue, {
      toValue: 0,
      duration,
      easing: easings.easeIn,
      useNativeDriver: true,
    });
  },

  // Scale animations
  scaleIn: (animatedValue, duration = durations.normal) => {
    return Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      easing: easings.spring,
      useNativeDriver: true,
    });
  },

  scaleOut: (animatedValue, duration = durations.normal) => {
    return Animated.timing(animatedValue, {
      toValue: 0,
      duration,
      easing: easings.easeIn,
      useNativeDriver: true,
    });
  },

  // Slide animations
  slideInUp: (animatedValue, duration = durations.normal) => {
    return Animated.timing(animatedValue, {
      toValue: 0,
      duration,
      easing: easings.easeOut,
      useNativeDriver: true,
    });
  },

  slideInDown: (animatedValue, duration = durations.normal) => {
    return Animated.timing(animatedValue, {
      toValue: 0,
      duration,
      easing: easings.easeOut,
      useNativeDriver: true,
    });
  },

  slideOutUp: (animatedValue, distance, duration = durations.normal) => {
    return Animated.timing(animatedValue, {
      toValue: -distance,
      duration,
      easing: easings.easeIn,
      useNativeDriver: true,
    });
  },

  slideOutDown: (animatedValue, distance, duration = durations.normal) => {
    return Animated.timing(animatedValue, {
      toValue: distance,
      duration,
      easing: easings.easeIn,
      useNativeDriver: true,
    });
  },

  // Rotation animations
  rotate: (animatedValue, duration = durations.slowest) => {
    return Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        easing: easings.linear,
        useNativeDriver: true,
      })
    );
  },

  // Spring animations
  spring: (animatedValue, toValue = 1, config = {}) => {
    return Animated.spring(animatedValue, {
      toValue,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
      ...config,
    });
  },

  // Bounce animation
  bounce: (animatedValue) => {
    return Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 0.8,
        duration: durations.fast,
        easing: easings.easeOut,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1.1,
        duration: durations.fast,
        easing: easings.easeInOut,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: durations.fast,
        easing: easings.easeInOut,
        useNativeDriver: true,
      }),
    ]);
  },

  // Shake animation
  shake: (animatedValue) => {
    return Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]);
  },

  // Pulse animation
  pulse: (animatedValue) => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.1,
          duration: durations.slow,
          easing: easings.easeInOut,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: durations.slow,
          easing: easings.easeInOut,
          useNativeDriver: true,
        }),
      ])
    );
  },

  // Slide and fade combination
  slideAndFade: (slideValue, fadeValue, duration = durations.normal) => {
    return Animated.parallel([
      Animated.timing(slideValue, {
        toValue: 0,
        duration,
        easing: easings.easeOut,
        useNativeDriver: true,
      }),
      Animated.timing(fadeValue, {
        toValue: 1,
        duration,
        easing: easings.easeOut,
        useNativeDriver: true,
      }),
    ]);
  },
};

// Animation hooks
export const useAnimatedValue = (initialValue = 0) => {
  return new Animated.Value(initialValue);
};

// Animation presets for common UI elements
export const presets = {
  // Button press animation
  buttonPress: {
    scale: 0.95,
    duration: durations.fastest,
    easing: easings.easeInOut,
  },

  // Modal entrance
  modalEnter: {
    initialScale: 0.8,
    initialOpacity: 0,
    duration: durations.normal,
    easing: easings.easeOut,
  },

  // Card entrance
  cardEnter: {
    initialTranslateY: 20,
    initialOpacity: 0,
    duration: durations.normal,
    easing: easings.easeOut,
  },

  // Loading spinner
  spinner: {
    duration: durations.slowest,
    easing: easings.linear,
  },

  // Tab transition
  tabTransition: {
    duration: durations.fast,
    easing: easings.easeInOut,
  },

  // Screen transition
  screenTransition: {
    duration: durations.normal,
    easing: easings.easeInOut,
  },
};

// Timing functions for common animations
export const timingFunctions = {
  // Standard material design curves
  standard: Easing.bezier(0.4, 0.0, 0.2, 1),
  decelerate: Easing.bezier(0.0, 0.0, 0.2, 1),
  accelerate: Easing.bezier(0.4, 0.0, 1, 1),
  sharp: Easing.bezier(0.4, 0.0, 0.6, 1),
  
  // Custom curves
  smooth: Easing.bezier(0.25, 0.46, 0.45, 0.94),
  gentle: Easing.bezier(0.25, 0.25, 0.75, 0.75),
};

// Complex animation sequences
export const sequences = {
  // Staggered entrance for lists
  staggeredEntrance: (animatedValues, staggerDelay = 50) => {
    const animations = animatedValues.map((value, index) =>
      Animated.timing(value, {
        toValue: 1,
        duration: durations.normal,
        delay: index * staggerDelay,
        easing: easings.easeOut,
        useNativeDriver: true,
      })
    );
    return Animated.parallel(animations);
  },

  // Success feedback animation
  successFeedback: (scaleValue, opacityValue) => {
    return Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: durations.fast,
          easing: easings.easeOut,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: durations.fast,
          easing: easings.easeOut,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: durations.fast,
        easing: easings.easeInOut,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: durations.normal,
        easing: easings.easeIn,
        useNativeDriver: true,
      }),
    ]);
  },

  // Error shake animation
  errorShake: (translateValue) => {
    return Animated.sequence([
      Animated.timing(translateValue, {
        toValue: -5,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(translateValue, {
        toValue: 5,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(translateValue, {
        toValue: -3,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(translateValue, {
        toValue: 3,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(translateValue, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]);
  },
};

export default animations;
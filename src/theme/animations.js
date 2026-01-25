// src/theme/animations.js

import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
  SlideInLeft,
  ZoomIn,
  BounceIn,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';

/**
 * ✨ SYSTÈME D'ANIMATIONS PROFESSIONNEL
 * Animations fluides et cohérentes pour l'UX
 */

// Configurations d'animation
export const animationConfig = {
  spring: {
    damping: 15,
    stiffness: 100,
    mass: 1,
  },
  timing: {
    duration: 300,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  },
  fast: {
    duration: 150,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  },
  slow: {
    duration: 500,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  },
};

// Fonctions d'animation utilitaires
export const animateSpring = (value, toValue) => {
  return withSpring(toValue, animationConfig.spring);
};

export const animateTiming = (value, toValue, config = animationConfig.timing) => {
  return withTiming(toValue, config);
};

// Animations d'entrée prédéfinies
export const entranceAnimations = {
  fadeIn: FadeIn,
  fadeInDown: FadeInDown.springify(),
  fadeInUp: FadeInUp.springify(),
  slideInRight: SlideInRight.springify(),
  slideInLeft: SlideInLeft.springify(),
  zoomIn: ZoomIn.springify(),
  bounceIn: BounceIn.springify(),
};

// Animations pour les listes (staggered)
export const listAnimations = {
  fadeInUp: (index) => FadeInDown.delay(index * 100).springify(),
  slideInRight: (index) => SlideInRight.delay(index * 50).springify(),
  zoomIn: (index) => ZoomIn.delay(index * 75).springify(),
};

// Animations pour les interactions
export const interactionAnimations = {
  scale: (pressed) => ({
    transform: [{ scale: pressed ? 0.95 : 1 }],
  }),
  glow: (pressed) => ({
    shadowOpacity: pressed ? 0.8 : 0.4,
    shadowRadius: pressed ? 16 : 8,
  }),
};

export { Animated };
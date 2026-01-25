// src/theme/typography.js

import { Platform } from 'react-native';

/**
 * 🔤 TYPOGRAPHIE MODERNE
 * Design system avec hiérarchie claire
 * Optimisé pour dark theme
 */

// Font families - Utilise les fonts système modernes
const fontFamily = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  semibold: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'System',
  }),
};

export const typography = {
  // Display - Pour les grands titres hero
  display: {
    fontFamily: fontFamily.bold,
    fontSize: 48,
    lineHeight: 56,
    fontWeight: '800',
    letterSpacing: -1,
  },
  
  // Titres
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: fontFamily.semibold,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },
  h4: {
    fontFamily: fontFamily.semibold,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
  },
  h5: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  
  // Corps de texte
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  bodyMedium: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  bodySmallMedium: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  
  // Captions et labels
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  captionMedium: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  overline: {
    fontFamily: fontFamily.semibold,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  
  // Spéciaux
  button: {
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  buttonSmall: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  
  // Stats et nombres
  stat: {
    fontFamily: fontFamily.bold,
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  statSmall: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
  },
  statLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
};

export { fontFamily };

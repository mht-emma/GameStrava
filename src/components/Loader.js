// src/components/Loader.js

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Animated } from 'react-native';
import { colors, spacing, typography } from '../theme';

/**
 * ⏳ INDICATEUR DE CHARGEMENT MODERNE
 * Design dark theme avec animation
 * 
 * @param {string} size - Taille: 'small' | 'large'
 * @param {string} color - Couleur du spinner
 * @param {string} text - Texte optionnel
 * @param {boolean} fullScreen - Prend tout l'écran ou non
 * @param {string} variant - 'default' | 'overlay' | 'inline'
 */
const Loader = ({ 
  size = 'large', 
  color = colors.primary,
  text = null,
  fullScreen = true,
  variant = 'default',
}) => {
  const getContainerStyle = () => {
    switch (variant) {
      case 'overlay':
        return styles.overlay;
      case 'inline':
        return styles.inline;
      default:
        return fullScreen ? styles.container : styles.inline;
    }
  };

  return (
    <View style={getContainerStyle()}>
      <View style={styles.loaderWrapper}>
        <ActivityIndicator size={size} color={color} />
        {text && (
          <Text style={styles.text}>{text}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.overlay,
    zIndex: 1000,
  },
  inline: {
    padding: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  text: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});

export default Loader;

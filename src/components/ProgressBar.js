// src/components/ProgressBar.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';

/**
 * 📊 BARRE DE PROGRESSION
 * Design moderne avec animation et glow
 * 
 * @param {number} progress - Progression de 0 à 100
 * @param {string} variant - 'default' | 'glow' | 'gradient'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} showLabel - Affiche le pourcentage
 * @param {string} label - Label personnalisé (ex: "5/10 km")
 * @param {string} color - Couleur personnalisée
 */
const ProgressBar = ({
  progress = 0,
  variant = 'default',
  size = 'md',
  showLabel = false,
  label,
  color = colors.primary,
  style,
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const getHeight = () => {
    switch (size) {
      case 'sm': return 6;
      case 'lg': return 12;
      default: return 8;
    }
  };

  const getGlowStyle = () => {
    if (variant !== 'glow') return {};
    return {
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 4,
    };
  };

  return (
    <View style={[styles.container, style]}>
      {(showLabel || label) && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label || `${Math.round(clampedProgress)}%`}</Text>
        </View>
      )}
      <View style={[styles.track, { height: getHeight() }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${clampedProgress}%`,
              height: getHeight(),
              backgroundColor: color,
            },
            getGlowStyle(),
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.captionMedium,
    color: colors.text.secondary,
  },
  track: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.gray.medium + '20',
  },
  fill: {
    borderRadius: borderRadius.full,
  },
});

export default ProgressBar;

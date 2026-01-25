// src/components/Badge.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';

/**
 * 🏷️ BADGE MODERNE
 * Pour afficher des statuts, tags, etc.
 * 
 * @param {string} label - Texte du badge
 * @param {string} variant - 'default' | 'success' | 'error' | 'warning' | 'info' | 'primary'
 * @param {string} size - 'sm' | 'md'
 * @param {string} icon - Emoji optionnel
 */
const Badge = ({
  label,
  variant = 'default',
  size = 'md',
  icon,
  style,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: colors.primaryMuted,
          text: colors.primary,
        };
      case 'success':
        return {
          bg: colors.success + '20',
          text: colors.success,
        };
      case 'error':
        return {
          bg: colors.error + '20',
          text: colors.error,
        };
      case 'warning':
        return {
          bg: colors.warning + '20',
          text: colors.warning,
        };
      case 'info':
        return {
          bg: colors.info + '20',
          text: colors.info,
        };
      default:
        return {
          bg: colors.backgroundLighter,
          text: colors.text.secondary,
        };
    }
  };

  const colorScheme = getColors();
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colorScheme.bg,
          paddingVertical: isSmall ? spacing.xxs : spacing.xs,
          paddingHorizontal: isSmall ? spacing.sm : spacing.md,
        },
        style,
      ]}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text
        style={[
          isSmall ? styles.labelSmall : styles.label,
          { color: colorScheme.text },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  icon: {
    fontSize: 12,
  },
  label: {
    ...typography.captionMedium,
  },
  labelSmall: {
    ...typography.overline,
    fontSize: 10,
  },
});

export default Badge;

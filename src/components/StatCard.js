// src/components/StatCard.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';

/**
 * 📊 CARTE DE STATISTIQUE
 * Affiche une stat avec icône, valeur et label
 * Design moderne dark theme
 * 
 * @param {string} icon - Emoji ou icône
 * @param {string|number} value - Valeur principale
 * @param {string} label - Label descriptif
 * @param {string} unit - Unité (km, pts, etc.)
 * @param {string} variant - 'default' | 'highlight' | 'compact'
 * @param {string} trend - '+12%' ou '-5%' pour afficher une tendance
 */
const StatCard = ({
  icon,
  value,
  label,
  unit = '',
  variant = 'default',
  trend,
  style,
}) => {
  const isHighlight = variant === 'highlight';
  const isCompact = variant === 'compact';

  const getTrendColor = () => {
    if (!trend) return null;
    return trend.startsWith('+') ? colors.success : colors.error;
  };

  if (isCompact) {
    return (
      <View style={[styles.compactContainer, style]}>
        <Text style={styles.compactIcon}>{icon}</Text>
        <View style={styles.compactContent}>
          <Text style={styles.compactValue}>
            {value}
            {unit && <Text style={styles.compactUnit}> {unit}</Text>}
          </Text>
          <Text style={styles.compactLabel}>{label}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[
      styles.container,
      isHighlight && styles.highlightContainer,
      style,
    ]}>
      {icon && (
        <View style={[styles.iconContainer, isHighlight && styles.highlightIcon]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.valueRow}>
          <Text style={[styles.value, isHighlight && styles.highlightValue]}>
            {value}
          </Text>
          {unit && (
            <Text style={[styles.unit, isHighlight && styles.highlightUnit]}>
              {unit}
            </Text>
          )}
          {trend && (
            <View style={[styles.trendBadge, { backgroundColor: getTrendColor() + '20' }]}>
              <Text style={[styles.trendText, { color: getTrendColor() }]}>
                {trend}
              </Text>
            </View>
          )}
        </View>
        <Text style={[styles.label, isHighlight && styles.highlightLabel]}>
          {label}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  highlightContainer: {
    backgroundColor: colors.primary,
    ...shadows.glow,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundLighter,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightIcon: {
    backgroundColor: 'rgba(25, 25, 25, 0.2)',
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  value: {
    ...typography.stat,
    color: colors.text.primary,
  },
  highlightValue: {
    color: colors.text.inverse,
  },
  unit: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  highlightUnit: {
    color: colors.text.inverse,
    opacity: 0.8,
  },
  label: {
    ...typography.statLabel,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  highlightLabel: {
    color: colors.text.inverse,
    opacity: 0.8,
  },
  trendBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  trendText: {
    ...typography.captionMedium,
  },
  // Compact variant
  compactContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  compactIcon: {
    fontSize: 20,
  },
  compactContent: {
    flex: 1,
  },
  compactValue: {
    ...typography.h4,
    color: colors.text.primary,
  },
  compactUnit: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  compactLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});

export default StatCard;

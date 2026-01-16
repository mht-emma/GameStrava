// src/components/Card.js

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, shadows, spacing, borderRadius, cardPadding } from '../theme';

/**
 * 🃏 CARTE MODERNE
 * Design dark theme avec effet glassmorphism
 * 
 * @param {ReactNode} children - Contenu de la carte
 * @param {object} style - Styles personnalisés
 * @param {string} variant - 'default' | 'elevated' | 'outlined' | 'glass' | 'glow'
 * @param {function} onPress - Si défini, la carte devient cliquable
 * @param {boolean} noPadding - Désactive le padding interne
 */
const Card = ({ 
  children, 
  style,
  variant = 'default',
  onPress,
  noPadding = false,
}) => {
  const getCardStyle = () => {
    const baseStyle = {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.xl,
      padding: noPadding ? 0 : cardPadding.md, // 24px - Standard
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: colors.surface,
          ...shadows.md,
          borderWidth: 1,
          borderColor: colors.gray.medium + '20',
        };
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.gray.medium + '40',
        };
      case 'glass':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(25, 25, 25, 0.8)',
          borderWidth: 1,
          borderColor: colors.gray.medium + '30',
        };
      case 'glow':
        return {
          ...baseStyle,
          backgroundColor: colors.surface,
          ...shadows.glow,
          borderWidth: 2,
          borderColor: colors.primary + '60',
        };
      case 'flat':
        return {
          ...baseStyle,
          backgroundColor: colors.backgroundDark,
        };
      default:
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: colors.gray.medium + '20',
        };
    }
  };

  const cardContent = (
    <View style={[styles.card, getCardStyle(), style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});

export default Card;

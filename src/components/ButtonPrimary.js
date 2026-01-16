// src/components/ButtonPrimary.js

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { colors, shadows, spacing, borderRadius, typography, buttonHeight, buttonPadding } from '../theme';

/**
 * 🔘 BOUTON MODERNE
 * Design dark theme avec accent lime néon
 * 
 * @param {string} title - Texte du bouton
 * @param {function} onPress - Callback au clic
 * @param {boolean} loading - État de chargement
 * @param {boolean} disabled - Bouton désactivé
 * @param {string} variant - Style: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'error'
 * @param {string} size - Taille: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 * @param {string} icon - Emoji ou icône à afficher
 * @param {string} iconPosition - Position: 'left' | 'right'
 * @param {boolean} fullWidth - Prend toute la largeur
 * @param {object} style - Styles personnalisés
 */
const ButtonPrimary = ({ 
  title, 
  onPress, 
  loading = false, 
  disabled = false,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return colors.gray[700];
    
    switch (variant) {
      case 'primary':
        return colors.primary; // Lime néon
      case 'secondary':
        return colors.secondaryLight; // Dark gray
      case 'outline':
      case 'ghost':
        return 'transparent';
      case 'success':
        return colors.success;
      case 'error':
        return colors.error;
      case 'warning':
        return colors.warning;
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.text.disabled;
    
    switch (variant) {
      case 'primary':
        return colors.text.onPrimary; // Dark text on lime
      case 'outline':
        return colors.primary;
      case 'ghost':
        return colors.text.primary;
      case 'secondary':
        return colors.text.primary;
      case 'success':
      case 'error':
      case 'warning':
        return colors.text.inverse;
      default:
        return colors.text.onPrimary;
    }
  };

  const getBorderStyle = () => {
    if (variant === 'outline') {
      return {
        borderWidth: 2,
        borderColor: disabled ? colors.gray[600] : colors.primary,
      };
    }
    return {};
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'xs':
        return {
          height: buttonHeight.xs,
          paddingHorizontal: buttonPadding.xs,
          minWidth: 64, // Minimum touch target
        };
      case 'sm':
        return {
          height: buttonHeight.sm,
          paddingHorizontal: buttonPadding.sm,
          minWidth: 80,
        };
      case 'lg':
        return {
          height: buttonHeight.lg,
          paddingHorizontal: buttonPadding.lg,
          minWidth: 120,
        };
      case 'xl':
        return {
          height: buttonHeight.xl,
          paddingHorizontal: buttonPadding.xl,
          minWidth: 160,
        };
      default:
        return {
          height: buttonHeight.md,
          paddingHorizontal: buttonPadding.md,
          minWidth: 100,
        };
    }
  };

  const getTextStyle = () => {
    switch (size) {
      case 'xs':
      case 'sm':
        return typography.buttonSmall;
      default:
        return typography.button;
    }
  };

  const getShadowStyle = () => {
    if (disabled || variant === 'outline' || variant === 'ghost') return {};
    if (variant === 'primary') return shadows.glow;
    return shadows.sm;
  };

  const getBorderRadius = () => {
    return borderRadius.lg;
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator color={getTextColor()} size={size === 'xs' || size === 'sm' ? 'small' : 'large'} />;
    }

    const textElement = (
      <Text style={[getTextStyle(), { color: getTextColor() }, textStyle]}>
        {title}
      </Text>
    );

    if (!icon) return textElement;

    return (
      <View style={styles.contentRow}>
        {iconPosition === 'left' && <Text style={styles.icon}>{icon}</Text>}
        {textElement}
        {iconPosition === 'right' && <Text style={styles.icon}>{icon}</Text>}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        getSizeStyle(),
        getBorderStyle(),
        getShadowStyle(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  icon: {
    fontSize: 18,
  },
});

export default ButtonPrimary;

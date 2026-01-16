// src/components/Avatar.js

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, avatarSizes, typography } from '../theme';

/**
 * 👤 AVATAR MODERNE
 * Affiche une image, des initiales ou un emoji
 * 
 * @param {string} source - URL de l'image
 * @param {string} name - Nom pour générer les initiales
 * @param {string} emoji - Emoji à afficher
 * @param {string} size - 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl'
 * @param {boolean} showBorder - Affiche une bordure lime
 * @param {boolean} showBadge - Affiche un badge (ex: rang)
 * @param {string} badgeContent - Contenu du badge
 * @param {string} badgeColor - Couleur du badge
 */
const Avatar = ({
  source,
  name,
  emoji,
  size = 'md',
  showBorder = false,
  showBadge = false,
  badgeContent,
  badgeColor = colors.primary,
  style,
}) => {
  const getSize = () => avatarSizes[size] || avatarSizes.md;
  
  const getInitials = () => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getFontSize = () => {
    const avatarSize = getSize();
    return avatarSize * 0.4;
  };

  const getBadgeSize = () => {
    const avatarSize = getSize();
    return Math.max(16, avatarSize * 0.35);
  };

  const renderContent = () => {
    if (source) {
      return (
        <Image
          source={{ uri: source }}
          style={[styles.image, { width: getSize(), height: getSize() }]}
        />
      );
    }

    if (emoji) {
      return <Text style={[styles.emoji, { fontSize: getFontSize() * 1.2 }]}>{emoji}</Text>;
    }

    return (
      <Text style={[styles.initials, { fontSize: getFontSize() }]}>
        {getInitials()}
      </Text>
    );
  };

  return (
    <View style={[styles.wrapper, style]}>
      <View
        style={[
          styles.container,
          {
            width: getSize(),
            height: getSize(),
            borderRadius: getSize() / 2,
          },
          showBorder && styles.border,
        ]}
      >
        {renderContent()}
      </View>
      {showBadge && badgeContent && (
        <View
          style={[
            styles.badge,
            {
              width: getBadgeSize(),
              height: getBadgeSize(),
              borderRadius: getBadgeSize() / 2,
              backgroundColor: badgeColor,
            },
          ]}
        >
          <Text style={[styles.badgeText, { fontSize: getBadgeSize() * 0.6 }]}>
            {badgeContent}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  container: {
    backgroundColor: colors.backgroundLighter,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  border: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    ...typography.h4,
    color: colors.text.primary,
    fontWeight: '600',
  },
  emoji: {
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  badgeText: {
    color: colors.text.inverse,
    fontWeight: '700',
  },
});

export default Avatar;

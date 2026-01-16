// src/components/Icon.js

import React from 'react';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../theme';

/**
 * 🎯 ICÔNE VECTORIELLE PROFESSIONNELLE
 * Composant unifié pour toutes les icônes de l'app
 *
 * @param {string} name - Nom de l'icône (voir icons.js)
 * @param {number} size - Taille en pixels
 * @param {string} color - Couleur (utilise colors par défaut)
 * @param {string} set - Set d'icônes: 'Ionicons' | 'MaterialIcons' | 'FontAwesome5'
 */
const Icon = ({
  name,
  size = 24,
  color = colors.text.primary,
  set = 'Ionicons',
  style,
}) => {
  const IconComponent = { Ionicons, MaterialIcons, FontAwesome5 }[set];

  return (
    <IconComponent
      name={name}
      size={size}
      color={color}
      style={style}
    />
  );
};

export default Icon;
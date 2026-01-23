// src/theme/colors.js

/**
 * 🎨 PALETTE DE COULEURS GAMESTRAVA
 * Design moderne Dark Theme avec accent Lime néon
 * Inspiré des designs fitness modernes Dribbble
 */

export const colors = {
  // Couleurs principales - Vert pistache naturel
  primary: '#9ACD32',        // Vert pistache naturel (boutons, accents)
  primaryDark: '#7FB518',    // Version plus foncée
  primaryLight: '#B5D858',   // Version plus claire
  primaryMuted: 'rgba(154, 205, 50, 0.15)', // Pour backgrounds subtils

  // Couleurs secondaires - Dark theme (couleurs exactes demandées)
  secondary: '#191919',      // Gris très foncé
  secondaryLight: '#2A2A2A', // Cards, éléments surélevés
  secondaryLighter: '#5B5B5B', // Gris moyen (couleur demandée)

  // Gradients (pour LinearGradient) - Plus sophistiqués
  gradients: {
    primary: ['#9ACD32', '#7FB518'],
    dark: ['#000000', '#191919'], // Noir pur vers gris foncé
    card: ['rgba(42, 42, 42, 0.9)', 'rgba(42, 42, 42, 0.5)'],
    glow: ['rgba(154, 205, 50, 0.4)', 'rgba(154, 205, 50, 0)'],
    // Nouveaux gradients professionnels
    sunset: ['#FF6B35', '#F7931E', '#FFD23F'],
    ocean: ['#006D77', '#83C5BE', '#EDF6F9'],
    forest: ['#606C38', '#283618', '#FEFAE0'],
    neon: ['#9ACD32', '#B5D858', '#7FB518'],
    premium: ['#121212', '#000000', '#121212'], // Noir/Gris pour matcher le fond
    glass: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'],
  },

  // Status (pour les états de défis)
  success: '#4ADE80',        // Vert succès
  error: '#F87171',          // Rouge erreur
  warning: '#FBBF24',        // Orange attention
  info: '#60A5FA',           // Bleu information

  // Neutres
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    medium: '#5B5B5B', // Gris moyen spécifique
  },

  // Backgrounds - Dark theme (couleurs exactes demandées)
  background: '#000000',       // Noir pur (fond principal)
  backgroundDark: '#191919',   // Gris très foncé (alternative)
  backgroundLight: '#2A2A2A',  // Cards, modals
  backgroundLighter: '#5B5B5B', // Gris moyen pour éléments interactifs
  surface: '#191919',          // Surfaces élevées (gris foncé)
  surfaceLight: '#2A2A2A',     // Surfaces plus claires

  // Text - Pour dark theme
  text: {
    primary: '#FFFFFF',        // Blanc pur (texte principal)
    secondary: '#5B5B5B',      // Gris moyen (texte secondaire)
    tertiary: '#737373',       // Texte tertiaire
    disabled: '#5B5B5B',       // Texte désactivé (gris moyen)
    inverse: '#000000',        // Texte sur fond clair (noir)
    onPrimary: '#000000',      // Texte sur fond lime (noir)
    accent: '#CDFB47',         // Texte accent lime
  },

  // États des défis (pour l'UI)
  challenge: {
    invited: '#FBBF24',   // Jaune - En attente
    accepted: '#60A5FA',  // Bleu - Accepté
    active: '#CDFB47',    // Lime - En cours
    completed: '#4ADE80', // Vert - Terminé
    failed: '#F87171',    // Rouge - Échoué
    refused: '#737373',   // Gris - Refusé
  },

  // Overlay et effets
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  glow: 'rgba(205, 251, 71, 0.4)',
  shadow: 'rgba(0, 0, 0, 0.25)',

  // Strava brand
  strava: '#FC4C02',
};

// Shadows pour les cards (dark theme)
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#CDFB47',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
};

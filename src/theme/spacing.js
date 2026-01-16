// src/theme/spacing.js

/**
 * 📏 ESPACEMENTS ET TAILLES
 * Système de design moderne avec échelle cohérente
 * Basé sur une échelle de 4px pour une cohérence parfaite
 */

// Échelle de base: 4px (système 8-point grid)
export const spacing = {
  xxs: 2,    // 2px - Espacement minimal
  xs: 4,     // 4px - Très petit
  sm: 8,     // 8px - Petit
  md: 16,    // 16px - Moyen (standard)
  lg: 24,    // 24px - Grand
  xl: 32,    // 32px - Très grand
  xxl: 48,   // 48px - Extra large
  xxxl: 64,  // 64px - Très extra large
  xxxxl: 80, // 80px - Maximum
};

// Border radius - Cohérents et modernes
export const borderRadius = {
  xs: 4,     // 4px - Très petit (badges, tags)
  sm: 8,     // 8px - Petit (inputs compacts)
  md: 12,    // 12px - Moyen (inputs standard)
  lg: 16,    // 16px - Grand (boutons, cards)
  xl: 20,    // 20px - Très grand (cards importantes)
  xxl: 24,   // 24px - Extra large
  xxxl: 32,  // 32px - Très extra large
  full: 9999, // Cercle parfait
};

// Tailles d'icônes - Système cohérent
export const iconSizes = {
  xs: 12,    // 12px - Très petit
  sm: 16,    // 16px - Petit
  md: 20,    // 20px - Moyen (standard)
  lg: 24,    // 24px - Grand
  xl: 32,    // 32px - Très grand
  xxl: 48,   // 48px - Extra large
  xxxl: 64,  // 64px - Très extra large
};

// Hauteurs de boutons - Optimisées pour le touch
export const buttonHeight = {
  xs: 32,    // 32px - Compact (badges cliquables)
  sm: 40,    // 40px - Petit (actions secondaires)
  md: 48,    // 48px - Moyen (standard, minimum recommandé)
  lg: 56,    // 56px - Grand (actions principales)
  xl: 64,    // 64px - Très grand (CTA hero)
};

// Padding horizontal des boutons selon taille
export const buttonPadding = {
  xs: spacing.sm,   // 8px
  sm: spacing.md,    // 16px
  md: spacing.lg,    // 24px
  lg: spacing.xl,    // 32px
  xl: spacing.xxl,   // 48px
};

// Hauteurs d'inputs - Optimisées pour la saisie
export const inputHeight = {
  sm: 40,    // 40px - Compact
  md: 48,    // 48px - Standard (recommandé)
  lg: 56,    // 56px - Grand (formulaires importants)
};

// Padding horizontal des inputs
export const inputPadding = {
  sm: spacing.md,    // 16px
  md: spacing.lg,    // 24px
  lg: spacing.xl,    // 32px
};

// Tailles d'avatars - Système cohérent
export const avatarSizes = {
  xs: 24,    // 24px - Très petit
  sm: 32,    // 32px - Petit
  md: 40,    // 40px - Moyen
  lg: 56,    // 56px - Grand (standard)
  xl: 72,    // 72px - Très grand
  xxl: 96,   // 96px - Extra large
  xxxl: 120, // 120px - Très extra large (profil)
};

// Largeurs de cards - Pour layouts responsives
export const cardWidth = {
  sm: 140,   // 140px - Compact
  md: 180,   // 180px - Moyen
  lg: 220,   // 220px - Grand
  full: '100%', // Pleine largeur
};

// Padding des cards selon importance
export const cardPadding = {
  sm: spacing.md,    // 16px - Compact
  md: spacing.lg,    // 24px - Standard
  lg: spacing.xl,    // 32px - Important
};

// Marges entre sections
export const sectionSpacing = {
  xs: spacing.md,    // 16px - Sections proches
  sm: spacing.lg,    // 24px - Standard
  md: spacing.xl,    // 32px - Sections importantes
  lg: spacing.xxl,   // 48px - Sections majeures
};

// Hauteurs de sections UI
export const sectionHeight = {
  header: 60,        // 60px - Header standard
  tabBar: 80,        // 80px - Tab bar avec safe area
  bottomNav: 90,     // 90px - Navigation bottom
  inputRow: 56,      // 56px - Ligne d'input
};

// Safe areas - Pour iOS et Android
export const safeArea = {
  top: 44,           // 44px - iPhone notch
  bottom: 34,        // 34px - iPhone home indicator
};

// Animation durations (ms) - Pour fluidité
export const duration = {
  fast: 150,         // 150ms - Très rapide
  normal: 250,       // 250ms - Standard
  slow: 400,         // 400ms - Lent
  slower: 600,       // 600ms - Très lent
};

// Z-index layers - Hiérarchie visuelle
export const zIndex = {
  base: 0,           // Base
  card: 10,          // Cards
  dropdown: 100,     // Dropdowns
  modal: 1000,       // Modals
  toast: 2000,       // Toasts
  tooltip: 3000,     // Tooltips
};

// Touch targets - Minimum 44x44px pour accessibilité
export const touchTarget = {
  min: 44,           // 44px - Minimum recommandé
  comfortable: 48,   // 48px - Confortable
  large: 56,         // 56px - Grand (recommandé pour actions importantes)
};

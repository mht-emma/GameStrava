// src/theme/icons.js

import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

/**
 * 🎨 SYSTÈME D'ICÔNES PROFESSIONNEL
 * Icônes vectorielles cohérentes pour toute l'application
 */

export const icons = {
  // Navigation
  home: 'home-outline',
  homeFilled: 'home',
  challenges: 'trophy-outline',
  challengesFilled: 'trophy',
  profile: 'person-outline',
  profileFilled: 'person',
  ranking: 'podium-outline',
  rankingFilled: 'podium',

  // Actions
  add: 'add-circle-outline',
  edit: 'create-outline',
  delete: 'trash-outline',
  refresh: 'refresh-outline',
  sync: 'sync-outline',
  settings: 'settings-outline',
  logout: 'log-out-outline',
  search: 'search-outline',
  filter: 'filter-outline',
  sort: 'funnel-outline',

  // Sports
  running: 'walk-outline',
  cycling: 'bicycle-outline',
  swimming: 'water-outline',
  fitness: 'fitness-outline',
  workout: 'barbell-outline',

  // Stats
  star: 'star',
  starOutline: 'star-outline',
  fire: 'flame-outline',
  target: 'target-outline',
  calendar: 'calendar-outline',
  clock: 'time-outline',
  distance: 'map-outline',
  speed: 'speedometer-outline',
  points: 'trophy-outline',
  streak: 'flame-outline',

  // Status
  check: 'checkmark-circle',
  checkOutline: 'checkmark-circle-outline',
  close: 'close-circle',
  closeOutline: 'close-circle-outline',
  warning: 'warning-outline',
  error: 'alert-circle-outline',
  info: 'information-circle-outline',
  success: 'checkmark-circle-outline',

  // Social
  user: 'person-outline',
  users: 'people-outline',
  friend: 'person-add-outline',
  share: 'share-outline',
  like: 'heart-outline',
  likeFilled: 'heart',

  // Activity
  activity: 'pulse-outline',
  location: 'location-outline',
  navigation: 'navigate-outline',
  compass: 'compass-outline',

  // UI Elements
  menu: 'menu-outline',
  grid: 'grid-outline',
  list: 'list-outline',
  card: 'card-outline',
  eye: 'eye-outline',
  eyeOff: 'eye-off-outline',
  lock: 'lock-closed-outline',
  unlock: 'lock-open-outline',

  // Badges & Achievements
  badge: 'ribbon-outline',
  medal: 'medal-outline',
  award: 'trophy-outline',
  crown: 'crown-outline',
  certificate: 'document-text-outline',

  // Weather (for outdoor activities)
  sun: 'sunny-outline',
  cloud: 'cloud-outline',
  rain: 'rainy-outline',
  snow: 'snow-outline',

  // Time
  today: 'today-outline',
  week: 'calendar-outline',
  month: 'calendar-clear-outline',
  year: 'calendar-number-outline',
  info: 'information-circle-outline',

  // Social
  share: 'share-outline',
  heart: 'heart-outline',
  heartFilled: 'heart',
  comment: 'chatbubble-outline',
  like: 'thumbs-up-outline',
  mail: 'mail-outline',

  // UI
  menu: 'menu-outline',
  search: 'search-outline',
  filter: 'filter-outline',
  sort: 'funnel-outline',
  eye: 'eye-outline',
  eyeOff: 'eye-off-outline',
  lock: 'lock-closed-outline',
  unlock: 'lock-open-outline',

  // Navigation chevrons
  chevronRight: 'chevron-forward-outline',
  chevronLeft: 'chevron-back-outline',
  chevronUp: 'chevron-up-outline',
  chevronDown: 'chevron-down-outline',

  // Badges & Achievements
  medal: 'medal-outline',
  award: 'ribbon-outline',
  crown: 'crown-outline',
  badge: 'shield-outline',
  certificate: 'document-text-outline',

  // Communication & Social
  message: 'chatbubble-outline',
  notification: 'notifications-outline',
  email: 'mail-outline',
  phone: 'call-outline',
  video: 'videocam-outline',
  microphone: 'mic-outline',

  // Files & Documents
  file: 'document-outline',
  folder: 'folder-outline',
  download: 'download-outline',
  upload: 'cloud-upload-outline',
  attachment: 'attach-outline',

  // Health & Fitness spécifiques
  heart: 'heart-outline',
  heartbeat: 'pulse-outline',
  weight: 'scale-outline',
  height: 'resize-outline',
  steps: 'footsteps-outline',
  calories: 'flame-outline',
  water: 'water-outline',
  sleep: 'moon-outline',

  // Activity tracking
  gps: 'location-sharp',
  route: 'map-outline',
  compass: 'compass-outline',
  navigation: 'navigate-outline',

  // Weather
  sun: 'sunny-outline',
  cloud: 'cloud-outline',
  rain: 'rainy-outline',
  snow: 'snow-outline',
  wind: 'wind-outline',
  temperature: 'thermometer-outline',

  // Time management
  today: 'today-outline',
  timer: 'timer-outline',
  stopwatch: 'stopwatch-outline',
  schedule: 'time-outline',

  // Data & Analytics
  chart: 'bar-chart-outline',
  graph: 'trending-up-outline',
  analytics: 'analytics-outline',
  statistics: 'stats-chart-outline',

  // UI Components
  grid: 'grid-outline',
  list: 'list-outline',
  card: 'card-outline',
  menu: 'menu-outline',
  more: 'ellipsis-horizontal-outline',
  options: 'ellipsis-vertical-outline',
};

export const iconSets = {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
};

export const getIconSet = (iconName) => {
  // Détermine automatiquement le set d'icônes basé sur le nom
  if (iconName.includes('outline') || iconName.includes('filled')) {
    return Ionicons;
  }
  return Ionicons; // Default
};
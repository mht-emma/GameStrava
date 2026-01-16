// src/utils/challengeHelpers.js

/**
 * Configuration centralisée des types de défis
 * Cohérente avec challengeRules.js et les services
 */
export const challengeTypes = [
  {
    key: 'DISTANCE_TOTAL',
    label: 'Distance Totale',
    description: 'Parcourir une distance totale',
    unit: 'km',
    displayUnit: 'km',
    progressLabel: (progress, target) => `${progress || 0} / ${target} km`,
    shortLabel: (target) => `${target} km`
  },
  {
    key: 'ACTIVITY_COUNT',
    label: 'Nombre d\'Activités',
    description: 'Réaliser un nombre d\'activités',
    unit: 'activités',
    displayUnit: 'activités',
    progressLabel: (progress, target) => `${progress || 0} / ${target} activités`,
    shortLabel: (target) => `${target} activités`
  },
  {
    key: 'TOTAL_TIME',
    label: 'Temps Total',
    description: 'Cumuler du temps d\'activité',
    unit: 'minutes',
    displayUnit: 'min',
    progressLabel: (progress, target) => `${Math.round((progress || 0) / 60)} / ${Math.round(target / 60)} min`,
    shortLabel: (target) => `${Math.round(target / 60)} min`
  },
  {
    key: 'SINGLE_ACTIVITY_DISTANCE',
    label: 'Distance Unique',
    description: 'Parcourir une distance en une activité',
    unit: 'km',
    displayUnit: 'km',
    progressLabel: (progress, target) => `${progress || 0} / ${target} km`,
    shortLabel: (target) => `${target} km`
  },
  {
    key: 'REGULARITY',
    label: 'Régularité',
    description: 'Être actif un nombre de jours',
    unit: 'jours',
    displayUnit: 'jours',
    progressLabel: (progress, target) => `${progress || 0} / ${target} jours`,
    shortLabel: (target) => `${target} jours`
  }
];

/**
 * Obtenir les informations d'affichage pour un type de défi
 */
export const getChallengeTypeInfo = (type) => {
  return challengeTypes.find(t => t.key === type) || challengeTypes[0];
};

/**
 * Obtenir le label court pour un défi
 */
export const getChallengeShortLabel = (challenge) => {
  const typeInfo = getChallengeTypeInfo(challenge.type);
  return typeInfo.shortLabel(challenge.target);
};

/**
 * Obtenir le label de progression pour un défi
 */
export const getChallengeProgressLabel = (challenge) => {
  const typeInfo = getChallengeTypeInfo(challenge.type);
  return typeInfo.progressLabel(challenge.progress, challenge.target);
};
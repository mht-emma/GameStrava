// src/utils/pointsRules.js

/**
 * Retourne le nombre de points gagnés pour un défi complété
 */
export function calculateChallengePoints(challenge) {
  if (challenge.status !== "COMPLETED") {
    return 0;
  }

  const basePoints = getBasePoints(challenge.difficulty);
  const bonusPoints = getBonusPoints(challenge.type);

  return basePoints + bonusPoints;
}

/**
 * Points de base selon la difficulté
 */
function getBasePoints(difficulty) {
  switch (difficulty) {
    case "EASY":
      return 50;
    case "MEDIUM":
      return 100;
    case "HARD":
      return 200;
    default:
      return 0;
  }
}

/**
 * Bonus selon le type de défi
 */
function getBonusPoints(type) {
  switch (type) {
    case "REGULARITY":
      return 30;
    case "SINGLE_ACTIVITY_DISTANCE":
      return 20;
    case "TOTAL_TIME":
      return 10;
    case "DISTANCE_TOTAL":
      return 0;
    default:
      return 0;
  }
}

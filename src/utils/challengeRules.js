// src/utils/challengeRules.js

/**
 * Filtre les activités compatibles avec un défi
 */
function filterActivities(challenge, activities) {
  return activities.filter(activity => {
    const activityDate = new Date(activity.start_date);

    return (
      activity.type === challenge.sport &&
      activityDate >= new Date(challenge.start_date) &&
      activityDate <= new Date(challenge.end_date)
    );
  });
}

/**
 * Vérifie si un défi est complété
 */
export function isChallengeCompleted(challenge, activities) {
  const validActivities = filterActivities(challenge, activities);

  switch (challenge.type) {
    case "DISTANCE_TOTAL":
      return checkTotalDistance(challenge, validActivities);

    case "ACTIVITY_COUNT":
      return checkActivityCount(challenge, validActivities);

    case "TOTAL_TIME":
      return checkTotalTime(challenge, validActivities);

    case "SINGLE_ACTIVITY_DISTANCE":
      return checkSingleActivityDistance(challenge, validActivities);

    case "REGULARITY":
      return checkRegularity(challenge, validActivities);

    default:
      console.warn("Type de défi inconnu :", challenge.type);
      return false;
  }
}

/* =========================
   RÈGLES PAR TYPE DE DÉFI
   ========================= */

/**
 * Calcule la progression numérique d'un défi
 */
export function calculateChallengeProgress(challenge, activities) {
  const validActivities = filterActivities(challenge, activities);

  switch (challenge.type) {
    case "DISTANCE_TOTAL":
      return validActivities.reduce((sum, act) => sum + (act.distance || 0), 0);

    case "ACTIVITY_COUNT":
      return validActivities.length;

    case "TOTAL_TIME":
      return validActivities.reduce((sum, act) => sum + (act.elapsed_time || 0), 0);

    case "SINGLE_ACTIVITY_DISTANCE":
      // Pour un "max distance", la progression est la meilleure distance réalisée
      const maxDist = Math.max(...validActivities.map(a => a.distance || 0), 0);
      return Math.min(maxDist, challenge.target); // Cap at target for progress bar visual

    case "REGULARITY":
      const uniqueDays = new Set(
        validActivities.map(activity =>
          new Date(activity.start_date).toDateString()
        )
      );
      return uniqueDays.size;

    default:
      return 0;
  }
}

/* =========================
   RÈGLES PAR TYPE DE DÉFI
   ========================= */

function checkTotalDistance(challenge, activities) {
  const totalDistance = activities.reduce(
    (sum, activity) => sum + activity.distance,
    0
  );

  return totalDistance >= challenge.target;
}

function checkActivityCount(challenge, activities) {
  return activities.length >= challenge.target;
}

function checkTotalTime(challenge, activities) {
  const totalTime = activities.reduce(
    (sum, activity) => sum + activity.elapsed_time,
    0
  );

  return totalTime >= challenge.target;
}

function checkSingleActivityDistance(challenge, activities) {
  return activities.some(
    activity => activity.distance >= challenge.target
  );
}

function checkRegularity(challenge, activities) {
  const uniqueDays = new Set(
    activities.map(activity =>
      new Date(activity.start_date).toDateString()
    )
  );

  return uniqueDays.size >= challenge.target;
}

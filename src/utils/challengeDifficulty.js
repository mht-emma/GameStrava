// src/utils/challengeDifficulty.js

/**
 * Calcule la difficulté d’un défi
 * Retourne : "EASY" | "MEDIUM" | "HARD"
 */
export function calculateChallengeDifficulty(challenge) {
  const durationInDays = getDurationInDays(
    challenge.start_date,
    challenge.end_date
  );

  switch (challenge.type) {
    case "DISTANCE_TOTAL":
      return distanceDifficulty(challenge.target, durationInDays);

    case "ACTIVITY_COUNT":
      return countDifficulty(challenge.target, durationInDays);

    case "TOTAL_TIME":
      return timeDifficulty(challenge.target, durationInDays);

    case "REGULARITY":
      return regularityDifficulty(challenge.target, durationInDays);

    case "SINGLE_ACTIVITY_DISTANCE":
      return singleActivityDifficulty(challenge.target);

    default:
      return "MEDIUM";
  }
}

/* =========================
   HELPERS
   ========================= */

function getDurationInDays(start, end) {
  const ms = new Date(end) - new Date(start);
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

/* =========================
   RÈGLES PAR TYPE
   ========================= */

function distanceDifficulty(distance, days) {
  const perDay = distance / days;
  if (perDay <= 3) return "EASY";
  if (perDay <= 7) return "MEDIUM";
  return "HARD";
}

function countDifficulty(count, days) {
  const perDay = count / days;
  if (perDay <= 0.5) return "EASY";
  if (perDay <= 1) return "MEDIUM";
  return "HARD";
}

function timeDifficulty(timeInSeconds, days) {
  const minutesPerDay = (timeInSeconds / 60) / days;
  if (minutesPerDay <= 20) return "EASY";
  if (minutesPerDay <= 45) return "MEDIUM";
  return "HARD";
}

function regularityDifficulty(requiredDays, totalDays) {
  const ratio = requiredDays / totalDays;
  if (ratio <= 0.4) return "EASY";
  if (ratio <= 0.7) return "MEDIUM";
  return "HARD";
}

function singleActivityDifficulty(distance) {
  if (distance <= 5) return "EASY";
  if (distance <= 10) return "MEDIUM";
  return "HARD";
}

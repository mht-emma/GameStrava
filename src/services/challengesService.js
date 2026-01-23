import { supabase } from "../services/supabaseClient.js";
import { isChallengeCompleted, calculateChallengeProgress } from "../utils/challengeRules.js";
import { calculateChallengePoints } from "../utils/pointsRules.js";
import { calculateChallengeDifficulty } from "../utils/challengeDifficulty.js";

import { supabase } from "../services/supabaseClient.js";
import { isChallengeCompleted, calculateChallengeProgress } from "../utils/challengeRules.js";
import { calculateChallengePoints } from "../utils/pointsRules.js";
import { calculateChallengeDifficulty } from "../utils/challengeDifficulty.js";

/**
 * Récupérer les défis d’un utilisateur
 * via challenge_participant
 */
export async function fetchChallenges(userId) {
  const { data: challengesData, error } = await supabase
    .from("challenge_participant")
    .select(`
      status,
      challenge:challenges (*)
    `)
    .eq("user_id", userId);

  if (error) {
    console.error("Erreur fetchChallenges", error);
    return [];
  }

  const { data: activities, error: actError } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', userId);

  if (actError) {
    console.warn("Impossible de charger les activités pour la progression", actError);
  }

  const userActivities = activities || [];

  return challengesData.map(row => {
    const challenge = row.challenge;
    const progress = calculateChallengeProgress(challenge, userActivities);

    return {
      ...challenge,
      participant_status: row.status,
      progress: progress || 0,
    };
  });
}

/**
 * Met à jour le statut d’un participant
 */
export async function updateParticipantStatus(
  challengeId,
  userId,
  status,
  extra = {}
) {
  const { error } = await supabase
    .from("challenge_participant")
    .update({ status, ...extra })
    .eq("challenge_id", challengeId)
    .eq("user_id", userId);

  if (error) {
    console.error("Erreur updateParticipantStatus", error);
  }
}

/**
 * Créer un challenge + inviter des participants
 */
export async function createChallenge({
  creatorId,
  challengeData,
  invitedUserIds = []
}) {
  const { data: challenge, error } = await supabase
    .from("challenges")
    .insert({
      ...challengeData,
      created_by: creatorId,
      status: "ACTIVE"
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur createChallenge", error);
    throw error;
  }

  const participantsToAdd = [
    {
      challenge_id: challenge.challenge_id,
      user_id: creatorId,
      status: "ACTIVE"
    }
  ];

  if (invitedUserIds.length > 0) {
    invitedUserIds.forEach(uid => {
      participantsToAdd.push({
        challenge_id: challenge.challenge_id,
        user_id: uid,
        status: "INVITED"
      });
    });
  }

  const { error: inviteError } = await supabase
    .from("challenge_participant")
    .insert(participantsToAdd);

  if (inviteError) {
    console.error("Erreur ajout participants challenge", inviteError);
  }

  return challenge;
}

/**
 * Accepter une invitation
 */
export async function acceptChallenge(challengeId, userId) {
  const { error } = await supabase
    .from("challenge_participant")
    .update({ status: "ACTIVE" })
    .eq("challenge_id", challengeId)
    .eq("user_id", userId)
    .eq("status", "INVITED");

  if (error) {
    console.error("Erreur acceptChallenge", error);
    throw error;
  }
}

/**
 * Refuser une invitation
 */
export async function declineChallenge(challengeId, userId) {
  const { error } = await supabase
    .from("challenge_participant")
    .update({ status: "DECLINED" })
    .eq("challenge_id", challengeId)
    .eq("user_id", userId)
    .eq("status", "INVITED");

  if (error) {
    console.error("Erreur declineChallenge", error);
    throw error;
  }
}

/**
 * Vérifie et traite tous les défis actifs d’un utilisateur
 */
export async function processUserChallenges(userId) {
  const { data: participations, error } = await supabase
    .from("challenge_participant")
    .select(`
      status,
      challenge:challenges (*)
    `)
    .eq("user_id", userId)
    .eq("status", "ACTIVE");

  if (error) {
    console.error("Erreur chargement participations", error);
    return;
  }

  const { data: activities, error: activityError } = await supabase
    .from("activities")
    .select("*")
    .eq("user_id", userId);

  if (activityError) {
    console.error("Erreur chargement activités", activityError);
    return;
  }

  for (const row of participations) {
    const challenge = row.challenge;

    const completed = isChallengeCompleted(challenge, activities);
    if (!completed) continue;

    const difficulty =
      challenge.difficulty ??
      calculateChallengeDifficulty(challenge);

    const points = calculateChallengePoints({
      ...challenge,
      status: "COMPLETED",
      difficulty
    });

    // Update participant
    await updateParticipantStatus(
      challenge.challenge_id,
      userId,
      "COMPLETED"
    );

    // Persister la difficulty une seule fois
    if (!challenge.difficulty) {
      await supabase
        .from("challenges")
        .update({ difficulty })
        .eq("challenge_id", challenge.challenge_id);
    }

    // Log points
    await supabase.from("points_log").insert({
      user_id: userId,
      value: points,
      source: "CHALLENGE_COMPLETED"
    });
  }
}

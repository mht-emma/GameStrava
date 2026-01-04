import { supabase } from "../services/supabaseClient.js";
import { isChallengeCompleted } from "../utils/challengeRules.js";
import { calculateChallengePoints } from "../utils/pointsRules.js";
import { calculateChallengeDifficulty } from "../utils/challengeDifficulty.js";

/* =====================================================
   FETCH
   ===================================================== */

/**
 * Récupérer les défis d’un utilisateur
 * via challenge_participant
 */
export async function fetchChallenges(userId) {
  const { data, error } = await supabase
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

  return data.map(row => ({
    ...row.challenge,
    participant_status: row.status
  }));
}

/* =====================================================
   UPDATE PARTICIPANT
   ===================================================== */

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

/* =====================================================
   CREATE CHALLENGE
   ===================================================== */

/**
 * Créer un challenge + inviter des participants
 * ⚠️ Le créateur n’est PAS participant
 */
export async function createChallenge({
  creatorId,
  challengeData,
  invitedUserIds = []
}) {
  // 1️⃣ Créer le challenge
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

  // 2️⃣ Invitations
  if (invitedUserIds.length > 0) {
    const rows = invitedUserIds.map(userId => ({
      challenge_id: challenge.challenge_id,
      user_id: userId,
      status: "INVITED"
    }));

    const { error: inviteError } = await supabase
      .from("challenge_participant")
      .insert(rows);

    if (inviteError) {
      console.error("Erreur invitations challenge", inviteError);
    }
  }

  return challenge;
}

/* =====================================================
   INVITATION ACTIONS
   ===================================================== */

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

/* =====================================================
   CORE BUSINESS LOGIC
   ===================================================== */

/**
 * 🔥 LOGIQUE MÉTIER CENTRALE
 * Vérifie et traite tous les défis actifs d’un utilisateur
 */
export async function processUserChallenges(userId) {
  // 1️⃣ Défis actifs
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

  // 2️⃣ Activités utilisateur
  const { data: activities, error: activityError } = await supabase
    .from("activities")
    .select("*")
    .eq("user_id", userId);

  if (activityError) {
    console.error("Erreur chargement activités", activityError);
    return;
  }

  // 3️⃣ Traitement métier
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

    console.log(
      `✅ Défi ${challenge.challenge_id} complété (${difficulty}) → +${points} pts`
    );
  }
}

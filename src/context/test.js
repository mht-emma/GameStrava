import {
  createChallenge,
  fetchChallenges,
  acceptChallenge,
  declineChallenge,
  processUserChallenges
} from "../services/challengesService.js";

import { supabase } from "../services/supabaseClient.js";

async function runChallengeTest() {
  const user_A = "user_A";
  const user_B = "user_B";

  console.log("🚀 DÉBUT TEST CHALLENGE COMPLET");

  // Nettoyage DB
  await supabase.from("points_log").delete().neq("id", 0);
  await supabase.from("activities").delete().neq("id", 0);
  await supabase.from("challenge_participant").delete().neq("id", 0);
  await supabase.from("challenges").delete().neq("challenge_id", 0);
  console.log("🧹 DB nettoyée");

  /* ===========================
     1️⃣ CRÉATION DE 2 CHALLENGES
     =========================== */
  const challenge1 = await createChallenge({
    creatorId: user_A,
    challengeData: {
      type: "DISTANCE_TOTAL",
      target: 10,
      sport: "RUN",
      start_date: new Date(),
      end_date: new Date(Date.now() + 7 * 86400000)
    },
    invitedUserIds: [user_B]
  });
  console.log("✅ Challenge 1 créé :", challenge1.challenge_id);

  const challenge2 = await createChallenge({
    creatorId: user_A,
    challengeData: {
      type: "DISTANCE_TOTAL",
      target: 15,
      sport: "RUN",
      start_date: new Date(),
      end_date: new Date(Date.now() + 7 * 86400000)
    },
    invitedUserIds: [user_B]
  });
  console.log("✅ Challenge 2 créé :", challenge2.challenge_id);

  /* ===========================
     2️⃣ USER_B GÈRE LES INVITATIONS
     =========================== */
  // Vérification des invitations
  const userBChallengesBefore = await fetchChallenges(user_B);
  console.log("📩 Invitations USER_B :", userBChallengesBefore.length, "défis");

  // Accepter le premier
  await acceptChallenge(challenge1.challenge_id, user_B);
  console.log("🤝 USER_B a accepté le challenge 1");

  // Refuser le deuxième
  await declineChallenge(challenge2.challenge_id, user_B);
  console.log("❌ USER_B a refusé le challenge 2");

  /* ===========================
     3️⃣ AJOUT D'ACTIVITÉS POUR USER_B
     =========================== */
  await supabase.from("activities").insert([
    {
      activity_id: crypto.randomUUID(),
      user_id: user_B,
      type: "RUN",
      distance: 6,
      elapsed_time: 1800,
      start_date: new Date().toISOString()
    },
    {
      activity_id: crypto.randomUUID(),
      user_id: user_B,
      type: "RUN",
      distance: 5,
      elapsed_time: 1600,
      start_date: new Date().toISOString()
    }
  ]);
  console.log("🏃 Activités ajoutées pour USER_B (11km total > 10km target)");

  /* ===========================
     4️⃣ TRAITEMENT MÉTIER (PROCESS)
     =========================== */
  await processUserChallenges(user_B);
  console.log("🔥 Moteur métier exécuté pour USER_B");

  /* ===========================
     5️⃣ ÉTAT FINAL
     =========================== */
  const finalChallenges = await fetchChallenges(user_B);
  console.log("📊 État final USER_B :", finalChallenges.length, "défis");
  finalChallenges.forEach(c => {
    console.log(`  - ID ${c.challenge_id}: ${c.participant_status} (${c.difficulty || 'N/A'})`);
  });

  // Vérification des points
  const { data: points } = await supabase
    .from("points_log")
    .select("*")
    .eq("user_id", user_B);
  console.log("🏆 Points gagnés :", points?.length || 0);

  console.log("✅ FIN DU TEST - TOUTES MÉTHODES UTILISÉES");
}

runChallengeTest().catch(console.error);

// src/tests/testPhase1Full.js

import {
  createChallenge,
  fetchChallenges,
  updateParticipantStatus,
  processUserChallenges
} from "../services/challengesService.js";

import { supabase } from "../services/supabaseClient.js";

import { randomUUID } from "crypto";

const USER_A = "user_A";
const USER_B = "user_B";

async function cleanDB() {
  await supabase.from("points_log").delete().neq("id", 0);
  await supabase.from("activities").delete().neq("id", 0);
  await supabase.from("challenge_participant").delete().neq("id", 0);
  await supabase.from("challenges").delete().neq("challenge_id", 0);
}

async function insertActivitiesForUserB() {
  const activities = [
    {
      user_id: USER_B,
      type: "RUN",
      distance: 6,
      elapsed_time: 1800,
      start_date: new Date()
    },
    {
      user_id: USER_B,
      type: "RUN",
      distance: 5,
      elapsed_time: 1600,
      start_date: new Date()
    }
  ];

  const { error } = await supabase.from("activities").insert(activities);
  if (error) throw error;

  console.log("🏃 Activités insérées pour USER_B");
}

async function runTest() {
  console.log("🚀 DÉBUT TEST PHASE 1 COMPLET");

  await cleanDB();
  console.log("🧹 DB nettoyée");

  // 1️⃣ USER_A crée un challenge
  const challenge = await createChallenge({
    creatorId: USER_A,
    challengeData: {
      type: "DISTANCE_TOTAL",
      target: 10,
      sport: "RUN",
      start_date: new Date(),
      end_date: new Date(Date.now() + 7 * 86400000)
    },
    invitedUserIds: [USER_B]
  });

  console.log("✅ Challenge créé :", challenge.challenge_id);

  // 2️⃣ USER_B accepte l’invitation
  await updateParticipantStatus(
    challenge.challenge_id,
    USER_B,
    "ACTIVE"
  );

  console.log("🤝 USER_B a accepté le challenge");

  // 3️⃣ Vérification avant activités
  let challengesBefore = await fetchChallenges(USER_B);
  console.log("📥 Challenges AVANT activités :", challengesBefore);

  // 4️⃣ Ajout d’activités
  //await insertActivitiesForUserB();


await supabase.from("activities").insert({
  activity_id: randomUUID(),   // 🔥 OBLIGATOIRE
  user_id: "user_B",
  type: "RUN",
  distance: 20,
  elapsed_time: 1800,
  start_date: new Date().toISOString()
});

  // 5️⃣ Lancement moteur métier
  await processUserChallenges(USER_B);

  // 6️⃣ Vérification finale
  const challengesAfter = await fetchChallenges(USER_B);
  console.log("🏁 Challenges APRÈS process :", challengesAfter);

  const { data: points } = await supabase
    .from("points_log")
    .select("*")
    .eq("user_id", USER_B);

  console.log("🏆 Points gagnés :", points);

  console.log("🎉 TEST PHASE 1 TERMINÉ AVEC SUCCÈS");
}

runTest()
  .catch(err => {
    console.error("❌ ERREUR TEST", err);
  })
  .finally(() => {
    console.log("🟢 FIN DU SCRIPT");
  });

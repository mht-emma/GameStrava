import { useEffect, useState } from "react";
import {
  fetchChallenges,
  processUserChallenges,
  createChallenge,
  acceptChallenge as acceptChallengeService,
  declineChallenge as declineChallengeService
} from "../services/challengesService.js";

/**
 * Hook de lecture & orchestration
 * ❌ Aucune logique métier ici
 */
export function useChallenges(userId) {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadChallenges() {
    setLoading(true);
    const data = await fetchChallenges(userId);
    setChallenges(data);
    setLoading(false);
  }

  /**
   * L’UI déclenche la vérification
   * → le service décide
   */
  async function checkChallenges() {
    await processUserChallenges(userId);
    await loadChallenges();
  }

  /**
   * Création d’un challenge depuis l’UI
   */
  async function createNewChallenge(payload) {
    await createChallenge(payload);
    await loadChallenges();
  }

  /**
   * Accepter une invitation
   */
  async function acceptChallenge(challengeId) {
    await acceptChallengeService(challengeId, userId);
    await loadChallenges();
  }

  /**
   * Refuser une invitation
   */
  async function refuseChallenge(challengeId) {
    await declineChallengeService(challengeId, userId);
    await loadChallenges();
  }

  useEffect(() => {
    if (userId) {
      loadChallenges();
    }
  }, [userId]);

  return {
    challenges,
    loading,
    refreshChallenges: loadChallenges,
    checkChallenges,
    createChallenge: createNewChallenge,
    acceptChallenge,
    refuseChallenge
  };
}

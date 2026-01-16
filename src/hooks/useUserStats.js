import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient.js";

/**
 * Hook pour récupérer les statistiques utilisateur
 */
export function useUserStats(userId) {
  const [stats, setStats] = useState({
    weeklyActivities: 0,
    totalPoints: 0,
    activeChallenges: 0,
    totalDistance: 0,
    totalTime: 0
  });
  const [loading, setLoading] = useState(true);

  async function loadUserStats() {
    if (!userId) return;

    setLoading(true);
    try {
      // Récupérer les statistiques de la semaine
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      // Compter les activités de la semaine
      const { count: activitiesCount } = await supabase
        .from('user_activities')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('activity_date', weekAgo.toISOString().split('T')[0]);

      // Récupérer les points totaux
      const { data: pointsData } = await supabase
        .from('user_points')
        .select('total_points')
        .eq('user_id', userId)
        .single();

      // Compter les défis actifs
      const { count: challengesCount } = await supabase
        .from('challenge_participant')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'ACTIVE');

      // Calculer la distance et le temps totaux de la semaine
      const { data: activities } = await supabase
        .from('user_activities')
        .select('distance, moving_time')
        .eq('user_id', userId)
        .gte('activity_date', weekAgo.toISOString().split('T')[0]);

      const totalDistance = activities?.reduce((sum, activity) => sum + (activity.distance || 0), 0) || 0;
      const totalTime = activities?.reduce((sum, activity) => sum + (activity.moving_time || 0), 0) || 0;

      setStats({
        weeklyActivities: activitiesCount || 0,
        totalPoints: pointsData?.total_points || 0,
        activeChallenges: challengesCount || 0,
        totalDistance: Math.round(totalDistance / 1000), // Convertir en km
        totalTime: Math.round(totalTime / 3600) // Convertir en heures
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      // En cas d'erreur, utiliser des valeurs par défaut
      setStats({
        weeklyActivities: 0,
        totalPoints: 0,
        activeChallenges: 0,
        totalDistance: 0,
        totalTime: 0
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUserStats();
  }, [userId]);

  return {
    stats,
    loading,
    refreshStats: loadUserStats
  };
}
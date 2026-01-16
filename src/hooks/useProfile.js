import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient.js";

/**
 * Hook pour récupérer les données de profil utilisateur
 */
export function useProfile(userId) {
  const [profile, setProfile] = useState({
    user: {
      name: '',
      email: '',
      avatar: '👤',
      level: 1,
      xp: 0,
      xpToNextLevel: 1000,
      memberSince: ''
    },
    stats: {
      totalPoints: 0,
      challengesCompleted: 0,
      challengesWon: 0,
      totalActivities: 0,
      totalDistance: 0,
      currentStreak: 0,
      bestStreak: 0,
      rank: 0,
      weeklyActivities: 0,
      activeChallenges: 0
    },
    badges: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  async function loadProfile() {
    if (!userId) return;

    setLoading(true);
    try {
      // Récupérer les informations utilisateur
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      // Récupérer les statistiques
      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (statsError) throw statsError;

      // Récupérer les badges
      const { data: badgesData, error: badgesError } = await supabase
        .from('user_badges')
        .select(`
          *,
          badges (*)
        `)
        .eq('user_id', userId);

      if (badgesError) throw badgesError;

      // Récupérer l'activité récente
      const { data: activityData, error: activityError } = await supabase
        .from('user_activity_log')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (activityError) throw activityError;

      setProfile({
        user: {
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar || '👤',
          level: userData.level || 1,
          xp: userData.xp || 0,
          xpToNextLevel: userData.xp_to_next_level || 1000,
          memberSince: new Date(userData.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
        },
        stats: {
          totalPoints: statsData.total_points || 0,
          challengesCompleted: statsData.challenges_completed || 0,
          challengesWon: statsData.challenges_won || 0,
          totalActivities: statsData.total_activities || 0,
          totalDistance: statsData.total_distance || 0,
          currentStreak: statsData.current_streak || 0,
          bestStreak: statsData.best_streak || 0,
          rank: statsData.rank || 0,
          weeklyActivities: statsData.weekly_activities || 0,
          activeChallenges: statsData.active_challenges || 0
        },
        badges: badgesData.map(badge => ({
          id: badge.badges.id,
          name: badge.badges.name,
          emoji: badge.badges.emoji,
          unlocked: badge.unlocked,
          description: badge.badges.description
        })),
        recentActivity: activityData.map(activity => ({
          id: activity.id,
          type: activity.type,
          title: activity.title,
          points: activity.points,
          date: new Date(activity.created_at).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short'
          })
        }))
      });
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      // En cas d'erreur, utiliser des valeurs par défaut
      setProfile({
        user: {
          name: 'Utilisateur',
          email: '',
          avatar: '👤',
          level: 1,
          xp: 0,
          xpToNextLevel: 1000,
          memberSince: ''
        },
        stats: {
          totalPoints: 0,
          challengesCompleted: 0,
          challengesWon: 0,
          totalActivities: 0,
          totalDistance: 0,
          currentStreak: 0,
          bestStreak: 0,
          rank: 0
        },
        badges: [],
        recentActivity: []
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, [userId]);

  return {
    profile,
    loading,
    refreshProfile: loadProfile
  };
}
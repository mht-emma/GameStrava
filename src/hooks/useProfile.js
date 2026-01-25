import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient.js";

/**
 * Hook pour récupérer les données de profil utilisateur
 * ⚠️ Adapté au schéma SQL fourni (Calcul des stats à la volée)
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
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (userError) throw userError;

      const { data: pointsData, error: pointsError } = await supabase
        .from('points_log')
        .select('value')
        .eq('user_id', userId);

      if (pointsError) throw pointsError;
      const totalPoints = pointsData.reduce((acc, curr) => acc + curr.value, 0);

      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: false });

      if (activitiesError) throw activitiesError;

      const totalActivities = activitiesData.length;
      const totalDistance = activitiesData.reduce((acc, curr) => acc + (curr.distance || 0), 0) / 1000;

      const { data: challengesData, error: challengesError } = await supabase
        .from('challenge_participant')
        .select('status')
        .eq('user_id', userId);

      if (challengesError) throw challengesError;

      const challengesCompleted = challengesData.filter(c => c.status === 'COMPLETED').length;
      const challengesWon = challengesData.filter(c => c.status === 'WON').length;

      const { data: badgesData, error: badgesError } = await supabase
        .from('user_badge')
        .select(`
          badge_id,
          date_unlocked,
          badges (
            badge_id,
            name,
            description
          )
        `)
        .eq('user_id', userId);

      if (badgesError) throw badgesError;

      setProfile({
        user: {
          name: userData.first_name ? `${userData.first_name} ${userData.last_name || ''}`.trim() : userData.username,
          email: userData.email,
          avatar: userData.avatar || '👤',
          level: Math.floor(totalPoints / 1000) + 1,
          xp: totalPoints,
          xpToNextLevel: (Math.floor(totalPoints / 1000) + 1) * 1000,
          memberSince: new Date(userData.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
        },
        stats: {
          totalPoints,
          challengesCompleted,
          challengesWon,
          totalActivities,
          totalDistance: parseFloat(totalDistance.toFixed(1)),
          currentStreak: 0,
          bestStreak: 0,
          rank: 0,
          weeklyActivities: 0,
          activeChallenges: challengesData.filter(c => c.status === 'ACCEPTED' || c.status === 'ACTIVE').length
        },
        badges: badgesData.map(ub => ({
          id: ub.badges.badge_id,
          name: ub.badges.name,
          emoji: '🏅',
          unlocked: true,
          description: ub.badges.description
        })),
        recentActivity: activitiesData.slice(0, 5).map(activity => ({
          id: activity.activity_id,
          type: activity.type,
          title: `Activité ${new Date(activity.start_date).toLocaleDateString()}`,
          points: Math.floor((activity.distance || 0) / 100),
          date: new Date(activity.start_date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short'
          })
        }))
      });
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      setProfile(prev => ({ ...prev }));
    } finally {
      setLoading(false);
    }
  }

  async function updateUserProfile(updates) {
    if (!userId) return;

    try {
      const dbUpdates = {};

      // Handle name update (split into first/last)
      if (updates.name) {
        const parts = updates.name.trim().split(' ');
        dbUpdates.first_name = parts[0];
        dbUpdates.last_name = parts.slice(1).join(' ') || '';
      }

      // Handle other fields if needed (e.g. avatar)
      if (updates.avatar) {
        dbUpdates.avatar = updates.avatar;
      }

      const { error } = await supabase
        .from('users')
        .update(dbUpdates)
        .eq('user_id', userId);

      if (error) throw error;

      // Reload to reflect changes
      await loadProfile();
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error };
    }
  }

  useEffect(() => {
    loadProfile();
  }, [userId]);

  return {
    profile,
    loading,
    refreshProfile: loadProfile,
    updateUserProfile
  };
}
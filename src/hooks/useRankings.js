import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient.js";

/**
 * Hook pour récupérer le classement des utilisateurs
 */
export function useRankings(period = 'week', currentUserId = null) {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState(null);

  async function loadRankings() {
    setLoading(true);
    try {
      let dateFilter = null;
      if (period === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        dateFilter = weekAgo.toISOString().split('T')[0];
      } else if (period === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        dateFilter = monthAgo.toISOString().split('T')[0];
      }

      let query = supabase
        .from('user_points')
        .select(`
          user_id,
          total_points,
          weekly_points,
          monthly_points,
          users!inner(name, avatar)
        `)
        .order(period === 'week' ? 'weekly_points' : period === 'month' ? 'monthly_points' : 'total_points', { ascending: false })
        .limit(20);

      if (dateFilter) {
        query = query.gte('updated_at', dateFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      const rankingsWithRanks = data.map((user, index) => ({
        id: user.user_id,
        name: user.users.name,
        points: period === 'week' ? user.weekly_points : period === 'month' ? user.monthly_points : user.total_points,
        avatar: user.users.avatar || '👤',
        rank: index + 1,
        isCurrentUser: user.user_id === currentUserId,
        trend: '+0' // TODO: Calculer la tendance basée sur les données historiques
      }));

      setRankings(rankingsWithRanks);
      setCurrentUserRank(rankingsWithRanks.find(r => r.isCurrentUser));
    } catch (error) {
      console.error('Erreur lors du chargement du classement:', error);
      // En cas d'erreur, utiliser des données vides
      setRankings([]);
      setCurrentUserRank(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRankings();
  }, [period, currentUserId]);

  return {
    rankings,
    loading,
    currentUserRank,
    refreshRankings: loadRankings
  };
}
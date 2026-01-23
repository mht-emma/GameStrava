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
      // 1. Récupérer tous les utilisateurs
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('user_id, username, first_name, last_name, avatar');

      if (usersError) throw usersError;

      // 2. Récupérer tous les logs de points (filtrés par date si besoin)
      let query = supabase.from('points_log').select('user_id, value, date');

      // Filtre de date
      let dateFilter = null;
      if (period === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        dateFilter = weekAgo.toISOString();
        query = query.gte('date', dateFilter);
      } else if (period === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        dateFilter = monthAgo.toISOString();
        query = query.gte('date', dateFilter);
      }

      const { data: pointsLogs, error: pointsError } = await query;
      if (pointsError) throw pointsError;

      // 3. Agréger les points par utilisateur
      const pointsByUser = {};
      pointsLogs.forEach(log => {
        pointsByUser[log.user_id] = (pointsByUser[log.user_id] || 0) + log.value;
      });

      // 4. Construire le classement
      const rankingList = users.map(user => {
        const points = pointsByUser[user.user_id] || 0;
        const name = user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.username;
        return {
          id: user.user_id,
          name: name || 'Utilisateur',
          avatar: user.avatar || '👤',
          points: points,
          isCurrentUser: user.user_id === currentUserId,
          trend: '+0' // Placeholder
        };
      });

      // 5. Trier par points décroissants
      rankingList.sort((a, b) => b.points - a.points);

      // 6. Assigner les rangs
      const finalRankings = rankingList.map((item, index) => ({
        ...item,
        rank: index + 1
      }));

      setRankings(finalRankings);
      setCurrentUserRank(finalRankings.find(r => r.isCurrentUser));
    } catch (error) {
      console.error('Erreur lors du chargement du classement:', error);
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
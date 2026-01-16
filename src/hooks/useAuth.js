// src/hooks/useAuth.js

import { useState } from 'react';
import { loginWithStrava, exchangeCodeForToken, getAthlete } from '../services/stravaService';
import { supabase } from '../services/supabaseClient';
//pour test
import { getActivities } from '../services/stravaService';
import { syncActivities } from '../services/sync.service';

import {
  loginWithStrava,
  exchangeCodeForToken,
  getAthlete,
  getActivities,
} from '../services/stravaService';


export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
  totalDistanceKm: 0,
  avgPace: 0,});

  /**
   * =========================
   * LOGIN
   * =========================
   */
  const login = async () => {
    try {
      setLoading(true);

      // 1️⃣ Login Strava → récupérer le code
      const code = await loginWithStrava();

      // 2️⃣ Code → Token
      const tokenData = await exchangeCodeForToken(code);

      // 3️⃣ Token → Athlete
      const athlete = await getAthlete(tokenData.access_token);
      
      // 3️⃣ bis - Récupérer les activités
      const activitiesData = await getActivities(tokenData.access_token);
      // Filtrer uniquement les activités sportives utiles
      const validActivities = activitiesData.filter((a) => a.type === 'Run' || a.type === 'Walk' || a.type === 'Ride');
      // Calcul distance totale (en km)
      const totalDistanceMeters = validActivities.reduce(
        (sum, a) => sum + a.distance,
        0);
    
      const totalDistanceKm = totalDistanceMeters / 1000;
      // Calcul pace moyen (min/km) — uniquement pour Run & Walk
      const paceActivities = validActivities.filter(
        (a) => a.type === 'Run' || a.type === 'Walk');
        
      let avgPace = 0;
      if (paceActivities.length > 0) {
        const totalMovingTime = paceActivities.reduce(
            (sum, a) => sum + a.moving_time,
            0
        );
        avgPace = (totalMovingTime / 60) / (totalDistanceKm || 1);
      }
      
      setActivities(validActivities);
      setStats({
        totalDistanceKm: totalDistanceKm.toFixed(2),
        avgPace: avgPace.toFixed(2),
      });


      //🎯pour le test juste(voir les activités dans la console)
      const activities = await getActivities(tokenData.access_token);
      console.log('ACTIVITIES:', activities);

      // 4️⃣ Vérifier si le user existe dans Supabase
      const { data: existingUser, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('strava_athlete_id', athlete.id)
        .single();

      // 5️⃣ Si le user n’existe pas → créer
      if (!existingUser) {
        const { data: newUser } = await supabase
          .from('profiles')
          .insert({
            strava_athlete_id: athlete.id,
            username: athlete.username,
            avatar: athlete.profile,
          })
          .single();

        setUser(newUser);

        //pour test
        await syncActivities(tokenData.access_token, newUser.id);
        console.log('SYNC OK');

      } else {
        // 6️⃣ Sinon → utiliser le profil existant
        setUser(existingUser);
      }

    } catch (err) {
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * =========================
   * LOGOUT
   * =========================
   */
  const logout = () => {
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
  };
}
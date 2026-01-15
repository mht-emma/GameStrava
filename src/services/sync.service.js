// src/services/sync.service.js
import { getActivities } from './stravaService';
import { supabase } from './supabaseClient';

export async function syncActivities(accessToken, userId) {
  const activities = await getActivities(accessToken);

  const formattedActivities = activities.map((a) => ({
    strava_activity_id: a.id,
    user_id: userId,
    type: a.type,
    distance: a.distance,
    moving_time: a.moving_time,
    average_speed: a.average_speed,
    start_date: a.start_date,
    polyline: a.map?.summary_polyline ?? null,
  }));

  // upsert = insert ou update
  const { error } = await supabase
    .from('activities')
    .upsert(formattedActivities, {
      onConflict: 'strava_activity_id',
    });

  if (error) throw error;

  return formattedActivities.length;
}

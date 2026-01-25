import { getActivities } from './stravaService';
import { supabase } from './supabaseClient';
import { DEMO_MODE } from '../config/config';

export async function syncActivities(accessToken, userId) {
  if (DEMO_MODE) {
    console.log('🚧 [DEMO MODE] Bypass Sync Strava');
    return 0;
  }
  const activities = await getActivities(accessToken);

  const formattedActivities = activities.map((a) => ({
    activity_id: a.id.toString(), // Correction: Schema uses activity_id
    user_id: userId,
    type: a.type,
    distance: a.distance,
    moving_time: a.moving_time,
    // average_speed: a.average_speed, // Optional depending on schema? Schema doesn't list it but keeps it if table permits. Schema: type, distance, start_date, elapsed_time, moving_time.
    start_date: a.start_date, // Correction: Schema uses start_date
    // polyline: a.map?.summary_polyline ?? null, 
  }));

  // upsert = insert ou update
  const { error } = await supabase
    .from('activities')
    .upsert(formattedActivities, {
      onConflict: 'activity_id', // Correction PK
    });

  if (error) throw error;

  return formattedActivities.length;
}
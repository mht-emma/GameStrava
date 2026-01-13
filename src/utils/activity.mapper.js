//pour test
import { mapStravaActivity } from '../utils/activity.mapper';

export function mapStravaActivity(activity) {
  const distanceKm = activity.distance / 1000;

  const pace =
    activity.type === 'Run'
      ? (activity.moving_time / 60) / distanceKm
      : null;
   
      //pour test
  const mapped = formattedActivities.map(mapStravaActivity);
  console.log(mapped);

  return {
    id: activity.strava_activity_id,
    type: activity.type,
    distance_km: Number(distanceKm.toFixed(2)),
    pace_min_km: pace ? Number(pace.toFixed(2)) : null,
    start_date: new Date(activity.start_date),
    polyline: activity.polyline,
  };
}


/**
 * Calculates the distance between two points on Earth using the Haversine formula.
 * @param lat1 Latitude of the first point
 * @param lon1 Longitude of the first point
 * @param lat2 Latitude of the second point
 * @param lon2 Longitude of the second point
 * @returns The distance in kilometers
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  if (!lat1 || !lon1 || !lat2 || !lon2) {
    return Infinity;
  }
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

/**
 * Checks if an event is within a given radius from a central point.
 * @param eventLocation The location of the event { latitude, longitude }
 * @param userLocation The location of the user { latitude, longitude }
 * @param radiusKm The radius in kilometers
 * @returns True if the event is within the radius, false otherwise
 */
export const isEventNearby = (
  eventLocation: { latitude?: number | null; longitude?: number | null },
  userLocation: { latitude: number; longitude: number },
  radiusKm: number
): boolean => {
  if (typeof eventLocation.latitude !== 'number' || typeof eventLocation.longitude !== 'number') {
    return false;
  }
  const distance = calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    eventLocation.latitude,
    eventLocation.longitude
  );
  return distance <= radiusKm;
};


// Helper function to extract coordinates from different formats
export const extractEventCoordinates = (coordinates: any) => {
  if (!coordinates) return null;
  
  try {
    // Handle coordinates as an array [longitude, latitude]
    if (Array.isArray(coordinates) && coordinates.length >= 2) {
      return {
        latitude: Number(coordinates[1]),
        longitude: Number(coordinates[0])
      };
    }
    
    // Handle coordinates as an object with latitude/longitude properties
    if (typeof coordinates === 'object') {
      const coords = coordinates as any;
      if ('latitude' in coords && 'longitude' in coords) {
        return {
          latitude: Number(coords.latitude),
          longitude: Number(coords.longitude)
        };
      }
    }
  } catch (err) {
    console.error('Error processing coordinates:', err);
  }
  
  return null;
};


import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export interface LocationData {
  location: string;
  coordinates?: string;
  latitude?: number;
  longitude?: number;
}

export const useLocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);

  const getCurrentLocation = useCallback(async (): Promise<LocationData | null> => {
    setLoading(true);
    setError(null);

    try {
      if (!navigator.geolocation) {
        toast({
          title: "Geolocation not supported",
          description: "Your browser doesn't support location services.",
          variant: "destructive",
        });
        throw new Error('Geolocation is not supported by your browser');
      }

      // Get user's current position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve, 
          (err) => {
            console.error("Geolocation error:", err);
            reject(new Error(err.message));
          }, 
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      });

      const { latitude, longitude } = position.coords;
      console.log("Got coordinates:", latitude, longitude);
      
      // Due to CSP restrictions, we cannot call external APIs directly
      // Instead, create a reasonable location name based on the coordinates
      const coordinates = `${latitude},${longitude}`;
      const locationData = {
        location: `Location at ${latitude.toFixed(3)}, ${longitude.toFixed(3)}`,
        coordinates,
        latitude,
        longitude
      };

      toast({
        title: "Location detected",
        description: "Location coordinates captured successfully",
      });

      // Update the local state with the location data
      setCurrentLocation(locationData);
      return locationData;
    } catch (err: any) {
      console.error('Error getting current location:', err);
      setError(err.message || 'Could not determine your location');
      
      toast({
        title: "Location error",
        description: err.message || "Could not detect your location. Please enter it manually.",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getCurrentLocation,
    loading,
    error,
    currentLocation
  };
};

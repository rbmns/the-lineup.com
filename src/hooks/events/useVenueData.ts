import { useMemo, useState, useEffect } from 'react';
import { useVenues } from '@/hooks/useVenues';

export const useVenueData = () => {
  const { venues: allVenues, isLoading: isVenuesLoading, error } = useVenues();
  
  const venues = useMemo(() => {
    if (!allVenues) return [];
    return allVenues.map(venue => ({
      value: venue.id,
      label: venue.name
    }));
  }, [allVenues]);
  
  const [locations, setLocations] = useState<Array<{ value: string, label: string }>>([]);

  useEffect(() => {
    // This seems to be static, so we can keep it in useEffect.
    setLocations([
      { value: 'zandvoort-area', label: 'Zandvoort Area' }
    ]);
  }, []);

  return {
    venues,
    locations,
    isVenuesLoading,
    error,
  };
};


import { useState, useMemo, useEffect } from 'react';
import { useVenues } from '@/hooks/useVenues';
import { toast } from 'sonner';

export const useVenueFilter = () => {
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [showVenueFilter, setShowVenueFilter] = useState(false);
  
  const { venues, isLoading, error } = useVenues();

  useEffect(() => {
    if (error) {
      toast.error('Failed to load venues');
      console.error('Error setting up venues:', error);
    }
  }, [error]);

  const availableVenues = useMemo(() => {
    if (!venues) {
      return [];
    }
    const venueOptions = venues
      .filter(venue => venue.id && venue.name)
      .map(venue => ({
        value: venue.id || '',
        label: venue.name || 'Unnamed Venue'
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    
    console.log('Venues loaded for filtering:', venueOptions);
    return venueOptions;
  }, [venues]);

  const venueMap = useMemo(() => {
    const map = new Map<string, string>();
    availableVenues.forEach(venue => {
      map.set(venue.value, venue.label);
    });
    return map;
  }, [availableVenues]);

  return {
    selectedVenues,
    setSelectedVenues,
    availableVenues,
    showVenueFilter,
    setShowVenueFilter,
    isLoading,
    error,
    venueMap
  };
};

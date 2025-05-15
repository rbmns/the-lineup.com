
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useVenueFilter = () => {
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [availableVenues, setAvailableVenues] = useState<Array<{value: string, label: string}>>([]);
  const [showVenueFilter, setShowVenueFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Set up available venues - fetch from Supabase directly
  useEffect(() => {
    const fetchVenues = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('venues')
          .select('id, name')
          .order('name');
          
        if (error) throw error;
        
        if (data) {
          const venueOptions = data
            .filter(venue => venue.id && venue.name)
            .map(venue => ({
              value: venue.id || '',
              label: venue.name || 'Unnamed Venue'
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
          
          console.log('Venues loaded for filtering:', venueOptions);
          setAvailableVenues(venueOptions);
        }
      } catch (err) {
        console.error('Error setting up venues:', err);
        setError(err instanceof Error ? err : new Error('Unknown error loading venues'));
        toast.error('Failed to load venues');
        setAvailableVenues([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenues();
  }, []);

  // Memoized venue map for quick lookups
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

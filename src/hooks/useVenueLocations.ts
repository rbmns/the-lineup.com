
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useVenueLocations = () => {
  return useQuery({
    queryKey: ['venue-locations'],
    queryFn: async () => {
      console.log('Fetching venue locations...');
      const { data, error } = await supabase
        .from('venues')
        .select('city')
        .not('city', 'is', null)
        .order('city', { ascending: true });
      
      if (error) {
        console.error('Error fetching venue locations:', error.message);
        throw new Error(`Failed to fetch venue locations: ${error.message}`);
      }
      
      console.log('Successfully fetched venue locations data:', data);

      // Get unique cities
      const uniqueCities = [...new Set(data?.map(item => item.city).filter(Boolean))] as string[];

      if (uniqueCities.length === 0) {
        console.warn('No venue locations found in the venues table.');
        return ['Zandvoort', 'Amsterdam', 'Haarlem']; // Default locations
      }
      
      return uniqueCities;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

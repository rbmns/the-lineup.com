
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface VenueArea {
  id: string;
  name: string;
  display_order: number;
  cities?: string[];
}

export const useVenueAreas = () => {
  return useQuery({
    queryKey: ['venue-areas'],
    queryFn: async () => {
      try {
        // First get all venue areas
        const { data: areas, error: areasError } = await supabase
          .from('venue_areas')
          .select('*')
          .order('display_order', { ascending: true });

        if (areasError) {
          console.error('Error fetching venue areas:', areasError);
          throw areasError;
        }

        if (!areas) {
          return [];
        }

        // Then get the city mappings for each area
        const { data: cityMappings, error: cityError } = await supabase
          .from('venue_city_areas')
          .select('city_name, area_id');

        if (cityError) {
          console.error('Error fetching city mappings:', cityError);
          // Don't throw error here, just return areas without cities
        }

        // Combine areas with their cities
        const areasWithCities: VenueArea[] = areas.map(area => ({
          id: area.id,
          name: area.name,
          display_order: area.display_order,
          cities: cityMappings?.filter(mapping => mapping.area_id === area.id)
                    .map(mapping => mapping.city_name) || []
        }));

        console.log('Venue areas with cities:', areasWithCities);
        return areasWithCities;
      } catch (error) {
        console.error('Error in useVenueAreas:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });
};


import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { LocationCategory, convertAreasToCategories } from '@/utils/locationCategories';

export const useVenueAreas = () => {
  return useQuery({
    queryKey: ['venue-areas'],
    queryFn: async (): Promise<LocationCategory[]> => {
      console.log('Fetching venue areas and city mappings...');
      
      // Fetch areas
      const { data: areas, error: areasError } = await supabase
        .from('venue_areas')
        .select('id, name, display_order')
        .order('display_order', { ascending: true });
      
      if (areasError) {
        console.error('Error fetching venue areas:', areasError.message);
        throw new Error(`Failed to fetch venue areas: ${areasError.message}`);
      }
      
      // Fetch city-area mappings
      const { data: cityAreas, error: cityAreasError } = await supabase
        .from('venue_city_areas')
        .select('area_id, city_name');
      
      if (cityAreasError) {
        console.error('Error fetching venue city areas:', cityAreasError.message);
        throw new Error(`Failed to fetch venue city areas: ${cityAreasError.message}`);
      }
      
      console.log('Successfully fetched areas:', areas);
      console.log('Successfully fetched city areas:', cityAreas);

      if (!areas || areas.length === 0) {
        console.warn('No venue areas found in the database.');
        return [];
      }
      
      // Convert to LocationCategory format
      const categories = convertAreasToCategories(areas || [], cityAreas || []);
      console.log('Converted location categories:', categories);
      
      return categories;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

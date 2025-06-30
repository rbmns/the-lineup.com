
import { supabase } from '@/lib/supabase';
import TimezoneService from './timezoneService';

class LocationService {
  /**
   * Auto-categorize a venue to the appropriate area based on country
   */
  static async categorizeVenueToArea(venueCity: string): Promise<string | null> {
    if (!venueCity) return null;

    try {
      const country = await TimezoneService.getCountryForCity(venueCity);
      
      if (!country) return null;

      let targetAreaName: string;
      
      // Map countries to areas
      if (country === 'Portugal') {
        targetAreaName = 'ericeira';
      } else if (country === 'Netherlands') {
        targetAreaName = 'zandvoort';
      } else {
        // Default based on common patterns
        return null;
      }

      // Find the actual area ID from the database
      const { data: area } = await supabase
        .from('venue_areas')
        .select('id')
        .ilike('name', `%${targetAreaName}%`)
        .single();

      return area?.id || null;
    } catch (error) {
      console.error('Error categorizing venue to area:', error);
      return null;
    }
  }

  /**
   * Add city to area mapping
   */
  static async addCityToAreaMapping(cityName: string, areaId: string): Promise<void> {
    if (!cityName || !areaId) return;

    try {
      // Check if mapping already exists
      const { data: existing } = await supabase
        .from('venue_city_areas')
        .select('id')
        .eq('city_name', cityName)
        .eq('area_id', areaId)
        .single();

      if (existing) return; // Already exists

      // Add the mapping
      await supabase
        .from('venue_city_areas')
        .insert({
          city_name: cityName,
          area_id: areaId
        });

      console.log(`Added city "${cityName}" to area mapping`);
    } catch (error) {
      console.error('Error adding city to area mapping:', error);
    }
  }
}

export default LocationService;

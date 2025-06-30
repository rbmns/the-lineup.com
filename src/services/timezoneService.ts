
import { supabase } from '@/lib/supabase';

export interface CityTimezone {
  city_name: string;
  country_code: string;
  country_name: string;
  timezone: string;
}

class TimezoneService {
  private static cityTimezoneCache = new Map<string, CityTimezone>();

  /**
   * Get timezone information for a city
   */
  static async getCityTimezone(cityName: string): Promise<CityTimezone | null> {
    if (!cityName) return null;

    const cacheKey = cityName.toLowerCase();
    
    // Check cache first
    if (this.cityTimezoneCache.has(cacheKey)) {
      return this.cityTimezoneCache.get(cacheKey) || null;
    }

    try {
      // Try exact match first
      let { data, error } = await supabase
        .from('city_timezones')
        .select('*')
        .ilike('city_name', cityName)
        .single();

      // If no exact match, try partial match
      if (error || !data) {
        const { data: partialData, error: partialError } = await supabase
          .from('city_timezones')
          .select('*')
          .ilike('city_name', `%${cityName}%`)
          .limit(1)
          .single();

        if (partialError || !partialData) {
          console.warn(`No timezone found for city: ${cityName}`);
          return null;
        }
        data = partialData;
      }

      // Cache the result
      this.cityTimezoneCache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching city timezone:', error);
      return null;
    }
  }

  /**
   * Get the IANA timezone for a city (e.g., "Europe/Lisbon")
   */
  static async getTimezoneForCity(cityName: string): Promise<string> {
    const cityInfo = await this.getCityTimezone(cityName);
    return cityInfo?.timezone || 'Europe/Amsterdam'; // Default fallback
  }

  /**
   * Get the country for a city
   */
  static async getCountryForCity(cityName: string): Promise<string | null> {
    const cityInfo = await this.getCityTimezone(cityName);
    return cityInfo?.country_name || null;
  }

  /**
   * Get the user's browser timezone
   */
  static getUserTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  /**
   * Clear the cache (useful for testing or when data changes)
   */
  static clearCache(): void {
    this.cityTimezoneCache.clear();
  }
}

export default TimezoneService;

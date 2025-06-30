
import { supabase } from '@/lib/supabase';
import { Venue } from '@/types';
import { CreateVenueFormValues } from '@/components/venues/CreateVenueSchema';
import TimezoneService from '@/services/timezoneService';
import LocationService from '@/services/locationService';

type CreateVenueData = Partial<Omit<Venue, 'id' | 'slug' | 'created_at'>> & { creator_id?: string | null };

export const createVenue = async (venueData: CreateVenueFormValues): Promise<{ data: Venue | null; error: any }> => {
  try {
    console.log('Creating venue with data:', venueData);
    
    // Get current user (might be null for unauthenticated users)
    const { data: { user } } = await supabase.auth.getUser();
    
    // Auto-detect country if city is provided
    let country = null;
    if (venueData.city) {
      country = await TimezoneService.getCountryForCity(venueData.city);
    }
    
    // Create venue data - use the current user's ID as creator_id if authenticated, null if not
    const dataToInsert = {
      name: venueData.name,
      street: venueData.street || null,
      city: venueData.city || null,
      postal_code: venueData.postal_code || null,
      website: venueData.website || null,
      google_maps: venueData.google_maps || null,
      country: country,
      creator_id: user?.id || null // This will be null for unauthenticated users
    };

    console.log('Data to insert:', dataToInsert);

    // First create the venue
    const { data, error } = await supabase
      .from('venues')
      .insert(dataToInsert)
      .select()
      .single();

    if (error) {
      console.error('Error creating venue:', error);
      return { data: null, error };
    }

    console.log('Venue created successfully:', data);

    // If venue was created successfully and has a city, categorize it
    if (data && venueData.city) {
      try {
        const areaId = await LocationService.categorizeVenueToArea(venueData.city);
        if (areaId) {
          await LocationService.addCityToAreaMapping(venueData.city, areaId);
        }
      } catch (areaError) {
        console.warn('Could not categorize city to area:', areaError);
        // Don't fail venue creation if area mapping fails
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in createVenue:', error);
    return { data: null, error };
  }
};

export const updateVenue = async (id: string, venueData: CreateVenueFormValues): Promise<{ data: Venue | null; error: any }> => {
  try {
    // Auto-detect country if city is provided
    let country = null;
    if (venueData.city) {
      country = await TimezoneService.getCountryForCity(venueData.city);
    }

    const { data, error } = await supabase
      .from('venues')
      .update({
        name: venueData.name,
        street: venueData.street || null,
        city: venueData.city || null,
        postal_code: venueData.postal_code || null,
        website: venueData.website || null,
        google_maps: venueData.google_maps || null,
        country: country,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating venue:', error);
      return { data: null, error };
    }

    // If venue was updated successfully and has a city, categorize it
    if (data && venueData.city) {
      const areaId = await LocationService.categorizeVenueToArea(venueData.city);
      if (areaId) {
        await LocationService.addCityToAreaMapping(venueData.city, areaId);
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in updateVenue:', error);
    return { data: null, error };
  }
};

export const deleteVenue = async (id: string): Promise<{ error: any }> => {
  const { error } = await supabase
    .from('venues')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting venue:', error);
  }

  return { error };
};

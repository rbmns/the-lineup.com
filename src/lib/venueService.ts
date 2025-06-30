
import { supabase } from '@/lib/supabase';
import { Venue } from '@/types';
import { CreateVenueFormValues } from '@/components/venues/CreateVenueSchema';

type CreateVenueData = Partial<Omit<Venue, 'id' | 'slug' | 'created_at'>> & { creator_id?: string | null };

// Function to categorize city to area based on country/region
const categorizeCityToArea = async (city: string): Promise<string | null> => {
  if (!city) return null;
  
  const cityLower = city.toLowerCase();
  
  // Define area mappings based on country
  const areaMapping: Record<string, string> = {
    // Netherlands cities -> Zandvoort Area
    'zandvoort': 'zandvoort',
    'amsterdam': 'zandvoort',
    'haarlem': 'zandvoort',
    'leiden': 'zandvoort',
    'the hague': 'zandvoort',
    'den haag': 'zandvoort',
    'rotterdam': 'zandvoort',
    'utrecht': 'zandvoort',
    'eindhoven': 'zandvoort',
    'groningen': 'zandvoort',
    
    // Portugal cities -> Ericeira Area
    'ericeira': 'ericeira',
    'lisboa': 'ericeira',
    'lisbon': 'ericeira',
    'porto': 'ericeira',
    'cascais': 'ericeira',
    'sintra': 'ericeira',
    'peniche': 'ericeira',
    'nazaré': 'ericeira',
    'óbidos': 'ericeira',
    'obidos': 'ericeira',
  };
  
  // First try direct city match
  let targetAreaName = areaMapping[cityLower];
  
  // If no direct match, try to categorize by common patterns
  if (!targetAreaName) {
    // Check if it's in Portugal
    if (cityLower.includes('portugal') || cityLower.includes('pt') || 
        cityLower.includes('português') || cityLower.includes('portuguesa')) {
      targetAreaName = 'ericeira';
    }
    // Check if it's in Netherlands
    else if (cityLower.includes('netherlands') || cityLower.includes('holland') || 
             cityLower.includes('nederland') || cityLower.includes('nl')) {
      targetAreaName = 'zandvoort';
    }
    // Default categorization: assume European cities
    else {
      // Simple heuristic: if it sounds Portuguese, put in Ericeira
      if (cityLower.includes('ão') || cityLower.includes('ões') || 
          cityLower.includes('ça') || cityLower.includes('ção')) {
        targetAreaName = 'ericeira';
      } else {
        // Default to Zandvoort for other European cities
        targetAreaName = 'zandvoort';
      }
    }
  }
  
  if (!targetAreaName) return null;
  
  // Find the actual area ID from the database
  const { data: area } = await supabase
    .from('venue_areas')
    .select('id')
    .ilike('name', `%${targetAreaName}%`)
    .single();
    
  return area?.id || null;
};

// Function to add city to area mapping
const addCityToAreaMapping = async (city: string, areaId: string): Promise<void> => {
  if (!city || !areaId) return;
  
  // Check if mapping already exists
  const { data: existing } = await supabase
    .from('venue_city_areas')
    .select('id')
    .eq('city_name', city)
    .eq('area_id', areaId)
    .single();
    
  if (existing) return; // Already exists
  
  // Add the mapping
  await supabase
    .from('venue_city_areas')
    .insert({
      city_name: city,
      area_id: areaId
    });
    
  console.log(`Added city "${city}" to area mapping`);
};

export const createVenue = async (venueData: CreateVenueFormValues): Promise<{ data: Venue | null; error: any }> => {
  try {
    console.log('Creating venue with data:', venueData);
    
    // Get current user (might be null for unauthenticated users)
    const { data: { user } } = await supabase.auth.getUser();
    
    // Create venue data - use the current user's ID as creator_id if authenticated, null if not
    const dataToInsert = {
      name: venueData.name,
      street: venueData.street || null,
      city: venueData.city || null,
      postal_code: venueData.postal_code || null,
      website: venueData.website || null,
      google_maps: venueData.google_maps || null,
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
        const areaId = await categorizeCityToArea(venueData.city);
        if (areaId) {
          await addCityToAreaMapping(venueData.city, areaId);
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
    const { data, error } = await supabase
      .from('venues')
      .update({
        name: venueData.name,
        street: venueData.street || null,
        city: venueData.city || null,
        postal_code: venueData.postal_code || null,
        website: venueData.website || null,
        google_maps: venueData.google_maps || null,
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
      const areaId = await categorizeCityToArea(venueData.city);
      if (areaId) {
        await addCityToAreaMapping(venueData.city, areaId);
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

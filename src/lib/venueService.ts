import { supabase } from '@/lib/supabase';
import { Venue } from '@/types';
import { CreateVenueFormValues } from '@/components/venues/CreateVenueSchema';

// The type for venueData now includes creator_id as optional
type CreateVenueData = Partial<Omit<Venue, 'id' | 'slug' | 'created_at'>> & { creator_id?: string | null };

// Function to categorize city to area based on country/region
const categorizeCityToArea = async (city: string): Promise<string | null> => {
  if (!city) return null;
  
  const cityLower = city.toLowerCase();
  
  // Define area mappings - this can be expanded in the future
  const areaMapping: Record<string, string> = {
    // Portugal cities -> Ericeira Area
    'ericeira': 'ericeira-area',
    'lisboa': 'ericeira-area',
    'lisbon': 'ericeira-area',
    'porto': 'ericeira-area',
    'cascais': 'ericeira-area',
    'sintra': 'ericeira-area',
    'peniche': 'ericeira-area',
    'nazaré': 'ericeira-area',
    'óbidos': 'ericeira-area',
    'obidos': 'ericeira-area',
    
    // Netherlands cities -> Zandvoort Area
    'zandvoort': 'zandvoort-area',
    'amsterdam': 'zandvoort-area',
    'haarlem': 'zandvoort-area',
    'leiden': 'zandvoort-area',
    'the hague': 'zandvoort-area',
    'den haag': 'zandvoort-area',
    'rotterdam': 'zandvoort-area',
    'utrecht': 'zandvoort-area',
    'eindhoven': 'zandvoort-area',
    'groningen': 'zandvoort-area',
  };
  
  // First try direct city match
  let targetAreaName = areaMapping[cityLower];
  
  // If no direct match, try to categorize by common Portuguese/Dutch patterns
  if (!targetAreaName) {
    // Portuguese patterns (you can add more sophisticated logic here)
    if (cityLower.includes('portugal') || cityLower.includes('pt')) {
      targetAreaName = 'ericeira-area';
    }
    // Dutch patterns
    else if (cityLower.includes('netherlands') || cityLower.includes('holland') || cityLower.includes('nl')) {
      targetAreaName = 'zandvoort-area';
    }
  }
  
  if (!targetAreaName) return null;
  
  // Find the actual area ID from the database
  const { data: area } = await supabase
    .from('venue_areas')
    .select('id')
    .ilike('name', `%${targetAreaName.replace('-area', '')}%`)
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

export const createVenue = async (venueData: CreateVenueData): Promise<{ data: Venue | null; error: any }> => {
  try {
    // Create venue data with optional creator_id (can be null for non-authenticated users)
    const dataToInsert = {
      ...venueData,
      creator_id: venueData.creator_id || null
    };

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

    // If venue was created successfully and has a city, categorize it
    if (data && venueData.city) {
      const areaId = await categorizeCityToArea(venueData.city);
      if (areaId) {
        await addCityToAreaMapping(venueData.city, areaId);
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
      .update(venueData)
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

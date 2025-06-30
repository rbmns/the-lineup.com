
import { supabase } from '@/lib/supabase';
import { Venue } from '@/types';
import { CreateVenueFormValues } from '@/components/venues/CreateVenueSchema';

type CreateVenueData = Partial<Omit<Venue, 'id' | 'slug' | 'created_at'>> & { creator_id?: string | null };

// Improved function to categorize city to area with better coverage
const categorizeCityToArea = async (city: string): Promise<string | null> => {
  if (!city) return null;
  
  const cityLower = city.toLowerCase().trim();
  console.log('Categorizing city:', cityLower);
  
  // First, check if we already have a mapping for this city
  const { data: existingMapping } = await supabase
    .from('venue_city_areas')
    .select('area_id')
    .ilike('city_name', cityLower)
    .single();
    
  if (existingMapping) {
    console.log('Found existing mapping for city:', cityLower, 'to area:', existingMapping.area_id);
    return existingMapping.area_id;
  }
  
  // Extended area mapping with more comprehensive coverage
  const areaMapping: Record<string, string[]> = {
    'zandvoort': [
      'zandvoort', 'amsterdam', 'haarlem', 'leiden', 'the hague', 'den haag', 
      'rotterdam', 'utrecht', 'eindhoven', 'groningen', 'delft', 'tilburg',
      'breda', 'nijmegen', 'apeldoorn', 'enschede', 'amersfoort', 'zaanstad',
      'haarlemmermeer', 'zoetermeer', 'dordrecht', 'leiden', 'maastricht',
      'brabant', 'limburg', 'gelderland', 'overijssel', 'flevoland',
      'noord-holland', 'zuid-holland', 'zeeland', 'friesland', 'drenthe',
      'netherlands', 'holland', 'nederland', 'nl'
    ],
    'ericeira': [
      'ericeira', 'lisboa', 'lisbon', 'porto', 'cascais', 'sintra', 'peniche',
      'nazaré', 'nazare', 'óbidos', 'obidos', 'torres vedras', 'mafra',
      'lourinhã', 'lourinha', 'caldas da rainha', 'alcobaça', 'alcobaca',
      'leiria', 'coimbra', 'aveiro', 'braga', 'faro', 'setubal', 'evora',
      'beja', 'santarem', 'portalegre', 'castelo branco', 'guarda',
      'viseu', 'vila real', 'braganca', 'viana do castelo',
      'portugal', 'pt', 'português', 'portuguesa'
    ]
  };
  
  // Find which area this city should belong to
  let targetAreaName: string | null = null;
  
  for (const [areaName, cities] of Object.entries(areaMapping)) {
    if (cities.some(mappedCity => 
      cityLower.includes(mappedCity) || 
      mappedCity.includes(cityLower) ||
      cityLower === mappedCity
    )) {
      targetAreaName = areaName;
      break;
    }
  }
  
  // If no direct match, try pattern matching
  if (!targetAreaName) {
    if (cityLower.includes('portugal') || cityLower.includes('pt') || 
        cityLower.includes('português') || cityLower.includes('portuguesa') ||
        cityLower.match(/[ãáàâçéêíóôõú]/)) {
      targetAreaName = 'ericeira';
    } else if (cityLower.includes('netherlands') || cityLower.includes('holland') || 
               cityLower.includes('nederland') || cityLower.includes('nl')) {
      targetAreaName = 'zandvoort';
    } else {
      // Default to zandvoort for European cities
      targetAreaName = 'zandvoort';
    }
  }
  
  if (!targetAreaName) {
    console.warn('Could not determine area for city:', cityLower);
    return null;
  }
  
  console.log('Determined area for city:', cityLower, '->', targetAreaName);
  
  // Find the actual area ID from the database
  const { data: area, error } = await supabase
    .from('venue_areas')
    .select('id')
    .ilike('name', `%${targetAreaName}%`)
    .single();
    
  if (error || !area) {
    console.error('Could not find area in database:', targetAreaName, error);
    return null;
  }
  
  console.log('Found area ID:', area.id, 'for area name:', targetAreaName);
  return area.id;
};

// Function to add city to area mapping
const addCityToAreaMapping = async (city: string, areaId: string): Promise<void> => {
  if (!city || !areaId) return;
  
  const cityLower = city.toLowerCase().trim();
  
  // Check if mapping already exists
  const { data: existing } = await supabase
    .from('venue_city_areas')
    .select('id')
    .ilike('city_name', cityLower)
    .eq('area_id', areaId)
    .single();
    
  if (existing) {
    console.log('City mapping already exists:', cityLower, '->', areaId);
    return;
  }
  
  // Add the mapping
  const { error } = await supabase
    .from('venue_city_areas')
    .insert({
      city_name: cityLower,
      area_id: areaId
    });
    
  if (error) {
    console.error('Error adding city to area mapping:', error);
  } else {
    console.log(`Successfully added city "${cityLower}" to area mapping`);
  }
};

export const createVenue = async (venueData: CreateVenueFormValues): Promise<{ data: Venue | null; error: any }> => {
  try {
    console.log('Creating venue with data:', venueData);
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Create venue data - use the current user's ID as creator_id
    const dataToInsert = {
      name: venueData.name,
      street: venueData.street || null,
      city: venueData.city || null,
      postal_code: venueData.postal_code || null,
      website: venueData.website || null,
      google_maps: venueData.google_maps || null,
      creator_id: user?.id || null
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
        console.log('Attempting to categorize venue city:', venueData.city);
        const areaId = await categorizeCityToArea(venueData.city);
        if (areaId) {
          console.log('Adding city to area mapping:', venueData.city, '->', areaId);
          await addCityToAreaMapping(venueData.city, areaId);
          console.log('Successfully categorized venue into area');
        } else {
          console.warn('Could not determine area for city:', venueData.city);
        }
      } catch (areaError) {
        console.error('Error categorizing city to area:', areaError);
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
      try {
        const areaId = await categorizeCityToArea(venueData.city);
        if (areaId) {
          await addCityToAreaMapping(venueData.city, areaId);
        }
      } catch (areaError) {
        console.warn('Could not categorize city to area during update:', areaError);
        // Don't fail venue update if area mapping fails
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

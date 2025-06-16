
import { supabase } from '@/lib/supabase';
import { Venue } from '@/types';

// The type for venueData now includes creator_id and omits auto-generated fields
type CreateVenueData = Partial<Omit<Venue, 'id' | 'slug' | 'created_at'>> & { creator_id?: string };

export const createVenue = async (venueData: CreateVenueData): Promise<{ data: Venue | null; error: any }> => {
  const { data, error } = await supabase
    .from('venues')
    .insert(venueData)
    .select()
    .single();

  if (error) {
    console.error('Error creating venue:', error);
  }

  return { data, error };
};

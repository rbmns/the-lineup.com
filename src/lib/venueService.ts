
import { supabase } from '@/lib/supabase';
import { Venue } from '@/types';
import { CreateVenueFormValues } from '@/components/venues/CreateVenueSchema';

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

export const updateVenue = async (id: string, venueData: CreateVenueFormValues): Promise<{ data: Venue | null; error: any }> => {
  const { data, error } = await supabase
    .from('venues')
    .update(venueData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating venue:', error);
  }

  return { data, error };
};

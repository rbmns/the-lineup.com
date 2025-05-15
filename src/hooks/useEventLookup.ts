
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { asEqParam } from '@/utils/supabaseTypeUtils';

export const useEventLookup = () => {
  const lookupEventBySlug = useCallback(async (slug: string, city?: string) => {
    try {
      console.log(`Looking up event by slug: ${slug}${city ? ` in ${city}` : ''}`);
      let query = supabase
        .from('events')
        .select(`
          *,
          creator:profiles!creator(id, username, avatar_url, email, location, location_category, status, tagline),
          venues:venue_id(*),
          event_rsvps(id, user_id, status)
        `)
        .eq('slug', asEqParam(slug));
      
      // If city/destination is provided, filter by it
      if (city) {
        query = query.eq('destination', asEqParam(city));
      }
      
      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error("Error fetching event by slug:", error);
        throw error;
      }

      if (!data) {
        console.log(`No event found with slug: ${slug}${city ? ` in ${city}` : ''}`);
        return null;
      }

      return data;
    } catch (err) {
      console.error("Error in lookupEventBySlug:", err);
      return null;
    }
  }, []);

  // Add a new method to directly lookup events by ID
  const lookupEventById = useCallback(async (id: string) => {
    try {
      console.log(`Looking up event directly by ID: ${id}`);
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          creator:profiles!creator(id, username, avatar_url, email, location, location_category, status, tagline),
          venues:venue_id(*),
          event_rsvps(id, user_id, status)
        `)
        .eq('id', asEqParam(id))
        .maybeSingle();

      if (error) {
        console.error("Error fetching event by ID:", error);
        throw error;
      }

      if (!data) {
        console.log(`No event found with ID: ${id}`);
        return null;
      }

      return data;
    } catch (err) {
      console.error("Error in lookupEventById:", err);
      return null;
    }
  }, []);

  return { lookupEventBySlug, lookupEventById };
};


import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { safeSpread } from '@/utils/supabaseTypeUtils';

export const useEventAttendees = () => {
  const getAttendeesForEvent = useCallback(async (eventId: string) => {
    try {
      console.log('Fetching attendees for event:', eventId);
      
      // Get "Going" attendees - corrected query to proper join between event_rsvps and profiles
      const { data: goingData, error: goingError } = await supabase
        .from('event_rsvps')
        .select(`
          status,
          profiles!inner(*)
        `)
        .eq('event_id', eventId)
        .eq('status', 'Going');

      if (goingError) {
        console.error('Error fetching Going attendees:', goingError);
        throw goingError;
      }

      // Get "Interested" attendees
      const { data: interestedData, error: interestedError } = await supabase
        .from('event_rsvps')
        .select(`
          status,
          profiles!inner(*)
        `)
        .eq('event_id', eventId)
        .eq('status', 'Interested');

      if (interestedError) {
        console.error('Error fetching Interested attendees:', interestedError);
        throw interestedError;
      }

      // Process going attendees
      const goingAttendees = goingData?.map(item => {
        if (!item.profiles) return null;
        
        const profile = item.profiles;
        return profile ? safeSpread(profile) : null;
      }).filter(Boolean) || [];

      // Process interested attendees
      const interestedAttendees = interestedData?.map(item => {
        if (!item.profiles) return null;
        
        const profile = item.profiles;
        return profile ? safeSpread(profile) : null;
      }).filter(Boolean) || [];

      return {
        going: goingAttendees,
        interested: interestedAttendees,
      };
    } catch (error) {
      console.error('Error fetching event attendees:', error);
      return { going: [], interested: [] };
    }
  }, []);

  return {
    getAttendeesForEvent
  };
};

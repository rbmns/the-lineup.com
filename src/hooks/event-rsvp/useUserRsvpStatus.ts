
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export const useUserRsvpStatus = () => {
  const getUserEventRSVP = useCallback(async (userId: string, eventId: string) => {
    if (!userId || !eventId) return null;
    
    try {
      console.log(`Getting RSVP status for userId=${userId}, eventId=${eventId}`);
      const { data, error } = await supabase
        .from('event_rsvps')
        .select('id, status')
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .maybeSingle();
      
      if (error) {
        console.error('Error getting user event RSVP:', error);
        throw error;
      }
      
      console.log('RSVP status result:', data);
      
      if (data) {
        return {
          id: data.id,
          status: data.status
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user event RSVP:', error);
      return null;
    }
  }, []);

  return {
    getUserEventRSVP
  };
};

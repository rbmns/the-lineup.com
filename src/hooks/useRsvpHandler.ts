
import { useCallback, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { trackRsvp } from '@/utils/gtm';

/**
 * A hook to handle RSVP actions with proper caching to maintain RSVP state across pages
 */
export const useRsvpHandler = (
  user: User | null | undefined,
  handleRsvp: ((eventId: string, status: "Going" | "Interested") => Promise<boolean>) | undefined,
  rsvpInProgressRef: React.MutableRefObject<boolean>
) => {
  const queryClient = useQueryClient();
  
  const handleEventRsvp = useCallback(async (
    eventId: string, 
    status: "Going" | "Interested"
  ): Promise<boolean> => {
    if (!user || !handleRsvp) {
      return false;
    }

    if (rsvpInProgressRef.current) {
      console.log('RSVP request in progress, please wait');
      return false;
    }

    try {
      rsvpInProgressRef.current = true;
      const success = await handleRsvp(eventId, status);
      
      if (success) {
        // Track the RSVP event in GTM
        trackRsvp(eventId, status);
        
        // Invalidate all relevant queries to ensure fresh data
        queryClient.invalidateQueries({ queryKey: ['events'] });
        queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      }
      
      return success;
    } catch (error) {
      console.error('Error in RSVP handler:', error);
      return false;
    } finally {
      // Small delay to prevent multiple rapid clicks
      setTimeout(() => {
        rsvpInProgressRef.current = false;
      }, 300);
    }
  }, [user, handleRsvp, rsvpInProgressRef, queryClient]);

  return { handleEventRsvp };
};

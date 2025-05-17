
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
      
      // Store the eventId this action is for to prevent cross-event interference
      const thisEventId = eventId;
      
      // Perform the RSVP action with the specific event ID
      const success = await handleRsvp(thisEventId, status);
      
      if (success) {
        // Track the RSVP event in GTM
        trackRsvp(thisEventId, status);
        
        // Invalidate queries only for this specific event
        queryClient.invalidateQueries({ queryKey: ['event', thisEventId] });
        
        // For event lists, be more targeted with invalidation
        // Note: This is a compromise - we could be more granular but it would require
        // more complex cache manipulation logic
        queryClient.invalidateQueries({ queryKey: ['events'] });
      }
      
      return success;
    } catch (error) {
      console.error('Error in RSVP handler:', error);
      return false;
    } finally {
      // Small delay to prevent multiple rapid clicks
      setTimeout(() => {
        rsvpInProgressRef.current = false;
      }, 200);
    }
  }, [user, handleRsvp, rsvpInProgressRef, queryClient]);

  return { handleEventRsvp };
};

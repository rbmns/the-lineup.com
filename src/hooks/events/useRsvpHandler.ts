
import { useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';

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
  ): Promise<boolean | void> => {
    if (!user || !handleRsvp) {
      return false;
    }

    // Use event ID specific check to prevent cross-event interference
    const eventRsvpKey = `rsvp-${eventId}`;
    if ((window as any)[eventRsvpKey]) {
      console.log(`RSVP request in progress for event: ${eventId}, please wait`);
      return false;
    }

    try {
      // Set event-specific lock
      (window as any)[eventRsvpKey] = true;
      rsvpInProgressRef.current = true;
      
      const success = await handleRsvp(eventId, status);
      
      if (success) {
        // Invalidate all event-related queries to ensure fresh data across pages
        console.log('Invalidating queries after successful RSVP');
        queryClient.invalidateQueries({ queryKey: ['events'] });
        queryClient.invalidateQueries({ queryKey: ['event', eventId] });
        queryClient.invalidateQueries({ queryKey: ['filtered-events'] });
        queryClient.invalidateQueries({ queryKey: ['userEvents'] });
        queryClient.invalidateQueries({ queryKey: ['user-events'] });
      }
      
      return success;
    } catch (error) {
      console.error('Error in RSVP handler:', error);
      return false;
    } finally {
      // Small delay to prevent multiple rapid clicks
      setTimeout(() => {
        (window as any)[eventRsvpKey] = false;
        rsvpInProgressRef.current = false;
      }, 300);
    }
  }, [user, handleRsvp, rsvpInProgressRef, queryClient]);

  return { handleEventRsvp };
};

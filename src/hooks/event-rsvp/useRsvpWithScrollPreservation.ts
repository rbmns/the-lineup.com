
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useRsvpActions } from './useRsvpActions';
import { useScrollPosition } from '@/hooks/useScrollPosition';

/**
 * Enhanced hook for handling RSVP actions with reliable scroll position preservation
 */
export const useRsvpWithScrollPreservation = (userId: string | undefined) => {
  const { handleRsvp: baseHandleRsvp, loading } = useRsvpActions(userId);
  const { withScrollPreservation } = useScrollPosition();
  
  // Enhanced RSVP handler with reliable scroll preservation
  const handleRsvp = useCallback(async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    console.log(`useRsvpWithScrollPreservation: Starting RSVP action for event ${eventId} with status ${status}`);
    
    // Use the withScrollPreservation helper to maintain scroll position
    return withScrollPreservation(async () => {
      try {
        // Perform the RSVP action
        const success = await baseHandleRsvp(eventId, status);
        return success;
      } catch (error) {
        console.error('Error in RSVP with scroll preservation:', error);
        toast.error("Failed to update RSVP status");
        return false;
      }
    });
  }, [baseHandleRsvp, withScrollPreservation]);

  return {
    handleRsvp,
    loading
  };
};

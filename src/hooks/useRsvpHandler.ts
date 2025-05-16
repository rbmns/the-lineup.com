
import { MutableRefObject } from 'react';

/**
 * Hook to handle RSVP actions with proper UI feedback
 * @param user The current user object
 * @param handleRsvp The RSVP handler function
 * @param rsvpInProgressRef Reference to track if an RSVP is in progress
 * @returns Object with handleEventRsvp function
 */
export const useRsvpHandler = (
  user: any | null,
  handleRsvp: ((eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>) | undefined,
  rsvpInProgressRef: MutableRefObject<boolean>
) => {
  /**
   * Handle RSVP with proper event isolation
   * @param eventId The event ID
   * @param status The RSVP status ('Going' or 'Interested')
   * @returns Promise resolving to the result of the RSVP action
   */
  const handleEventRsvp = async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean | void> => {
    // Don't allow RSVPs if not logged in or if another RSVP is in progress
    if (!user || !handleRsvp || rsvpInProgressRef.current) return false;
    
    try {
      // Set RSVP in progress flag
      rsvpInProgressRef.current = true;
      
      // Call the RSVP handler
      const result = await handleRsvp(eventId, status);
      
      // Return the result
      return result;
    } catch (error) {
      console.error('Error in RSVP handler:', error);
      return false;
    } finally {
      // Clear RSVP in progress flag
      rsvpInProgressRef.current = false;
    }
  };
  
  return { handleEventRsvp };
};

export default useRsvpHandler;
